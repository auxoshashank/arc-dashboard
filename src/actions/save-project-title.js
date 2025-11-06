"use server";

import { API_ENDPOINTS, getApiEndpoint } from "@/config/apiEndpoints";
import { api } from "@/lib/api";
import { getTokenFromServerSession } from "@/lib/auth";

export async function saveProjectTitle(projectId, name, description, icon) {
  try {
    const payload = {
      name,
      description,
      icon,
    };
    const token = await getTokenFromServerSession();
    const res = await api.put(
      getApiEndpoint(API_ENDPOINTS.updateProjectData, { project_id: projectId }),
      payload,
      {
        "x-project-id": projectId,
        Authorization: `Bearer ${token}`,
      }
    );
    return res;
  } catch (error) {
    console.error("Failed to update project:", error);
    throw error;
  }

  // TODO: Revaluate the project title on the Project page
}
