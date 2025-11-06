"use server";

import { API_ENDPOINTS, getApiEndpoint } from "@/config/apiEndpoints";
import { api } from "@/lib/api";
import { getTokenFromServerSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveAgentConfig(solutionId, projectId, config) {
  try {
    const token = await getTokenFromServerSession();
    const res = await api.put(
      getApiEndpoint(API_ENDPOINTS.saveAgentConfig, {
        solution_id: solutionId,
      }),
      config,
      {
        "x-project-id": projectId,
        Authorization: `Bearer ${token}`,
      },
    );

    revalidatePath(`/studio/projects/${projectId}/solutions/${solutionId}`);

    return res;
  } catch (error) {
    console.error("Save agent config Error:", error);
    throw error;
  }
}
