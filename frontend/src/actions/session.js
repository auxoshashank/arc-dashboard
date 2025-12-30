import { API_ENDPOINTS, getApiEndpoint } from "@/config/apiEndpoints";
import { api } from "@/lib/api";

export async function fetchUserSessionsApi(
  userId,
  solutionId,
  projectId,
  token
) {
  try {
    const response = await api.get(
      getApiEndpoint(API_ENDPOINTS.userSessionsHistory, {
        userId,
        solutionId,
      }),
      {
        "x-project-id": projectId,
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {
    console.error("Fetch user sessions error:", error);
    throw error;
  }
}

export async function fetchSessionHistoryApi(sessionId, projectId, token) {
  try {
    const response = await api.get(
      getApiEndpoint(API_ENDPOINTS.sessionHistory, {
        session_id: sessionId,
      }),
      {
        "x-project-id": projectId,
        Authorization: `Bearer ${token}`,
      }
    );
    return response;
  } catch (error) {
    console.error("Fetch session history error:", error);
    throw error;
  }
}
