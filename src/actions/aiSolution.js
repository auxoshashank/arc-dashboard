"use server";

import { API_ENDPOINTS, getApiEndpoint } from "@/config/apiEndpoints";
import { api } from "@/lib/api";

export async function invokeAiSolution(
  userId,
  sessionId,
  solutionId,
  message,
  projectId,
  token
) {
  try {
    const requestBody = {
      user_id: userId,
      session_id: sessionId,
      solution_id: solutionId,
      params: {
        query: { message },
        instructions: {},
        arguments: {},
      },
    };

    const res = await api.post(
      API_ENDPOINTS.invokeExecuteAiSolution,
      requestBody,
      {
        Authorization: `Bearer ${token}`,
        "x-project-id": projectId,
      }
    );

    return res;
  } catch (error) {
    console.error("Invoke AI solution Error:", error);
    throw error;
  }
}

export async function pollInvokeAiSolution(executionId, projectId, token) {
  try {
    return await api.get(
      getApiEndpoint(API_ENDPOINTS.pollInvokeAiSolution, { executionId }),
      {
        Authorization: `Bearer ${token}`,
        "x-project-id": projectId,
      }
    );
  } catch (error) {
    console.error("Poll AI solution Error:", error);
    throw error;
  }
}
