"use server";

import { API_ENDPOINTS } from "@/config/apiEndpoints";
import { api } from "@/lib/api";
import { getTokenFromServerSession } from "@/lib/auth";

export async function createDataOps(payload) {
  try {
    const token = await getTokenFromServerSession();
    const res = await api.post(API_ENDPOINTS.createDataOps, payload, {
      "x-project-id": payload?.project_id,
      Authorization: `Bearer ${token}`,
    });
    return res;
  } catch (error) {
    console.error("Failed to create data ops:", error);
    return { success: false, message: error.message };
  }
}
