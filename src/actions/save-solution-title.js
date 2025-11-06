"use server";

import { API_ENDPOINTS, getApiEndpoint } from "@/config/apiEndpoints";
import { api } from "@/lib/api";
import { getTokenFromServerSession } from "@/lib/auth";

export async function saveSolutionTitle(solutionId, name, description, icon, projectId) {
  try {
    const payload = {
      name,
      description,
      icon,
    };
    const token = await getTokenFromServerSession();
    const res = await api.put(
      getApiEndpoint(API_ENDPOINTS.updateSolutionData, {
        solution_id: solutionId,
      }),
      payload,
      {
        "x-project-id": projectId,
        Authorization: `Bearer ${token}`,
      },
    );
    return res;
  } catch (error) {
    console.error("Failed to update solution:", error);
    throw error;
  }
}
