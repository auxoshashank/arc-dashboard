"use server";

import { API_ENDPOINTS, getApiEndpoint } from "@/config/apiEndpoints";
import { api } from "@/lib/api";
import { getTokenFromServerSession } from "@/lib/auth";

export async function dataOpsExecution({ data_ops_id, projectId }) {
  try {
    const token = await getTokenFromServerSession();
    const url = getApiEndpoint(API_ENDPOINTS.dataOpsExecution, { data_ops_id });
    const res = await api.post(
      url,
      {
        data_ops_id,
        status: { status: "Started" },
      },
      {
        "x-project-id": projectId,
        Authorization: `Bearer ${token}`,
      },
    );
    return res;
  } catch (error) {
    console.error("Failed to execute data ops:", error);
    return { success: false, message: error.message };
  }
}
