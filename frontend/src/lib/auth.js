import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { API_ENDPOINTS, getApiEndpoint } from "@/config/apiEndpoints";
import { api } from "./api";

export async function getTokenFromServerSession() {
  const session = await getServerSession(authOptions);
  return session?.accessToken || null;
}

export async function getUserRolesFromServerSession(projectId = "") {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken || null;
  if (!token) return [];

  try {
    const endpoint = projectId
      ? getApiEndpoint(API_ENDPOINTS.fetchUserRoles, { project_id: projectId })
      : API_ENDPOINTS.fetchUserOrgRoles;

    const res = await api.get(endpoint, {
      Authorization: `Bearer ${token}`,
      "x-project-id": projectId,
    });

    // Case 1: If API returns a flat array directly
    if (Array.isArray(res)) {
      return res;
    }

    // Case 2: If API returns object with resource_roles
    if (res) {
      if (projectId && res.resource_roles?.[projectId]) {
        const projectRoles = [...res.resource_roles[projectId]];
        if (res.is_org_admin) {
          projectRoles.push("damia.org.admin");
        }
        return {
          [projectId]: projectRoles,
        };
      }

      // For base fetch, return flat array of all roles
      let allRoles = Object.values(res.resource_roles || {}).flat();
      if (res.is_org_admin) {
        allRoles.push("damia.org.admin");
      }
      return allRoles;
    }

    // Fallback
    return session?.user?.roles || [];
  } catch (error) {
    console.error("Failed to fetch user roles.", error);
    return [];
  }
}
