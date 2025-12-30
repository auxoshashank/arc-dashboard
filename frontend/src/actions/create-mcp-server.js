"use server";

import { API_ENDPOINTS } from "@/config/apiEndpoints";
import { api } from "@/lib/api";
import { getTokenFromServerSession } from "@/lib/auth";

export async function createMcpServer(payload) {
  try {
    const token = await getTokenFromServerSession();
    const res = await api.post(API_ENDPOINTS.createMcpServer, payload, {
      "x-project-id": payload?.project_id,
      Authorization: `Bearer ${token}`,
    });
    return res;
  } catch (error) {
    console.error("Failed to create mcp-server:", error);
    return { success: false, message: error.message };
  }
}
