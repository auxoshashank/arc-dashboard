"use server";

import { API_ENDPOINTS } from "@/config/apiEndpoints";
import { api } from "@/lib/api";
import { getTokenFromServerSession } from "@/lib/auth";

export async function createProject(payload) {
  const token = await getTokenFromServerSession();
  try {
    const res = await api.post(API_ENDPOINTS.createProject, payload, {
      Authorization: `Bearer ${token}`,
    });
    return res;
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, message: error.message };
  }
}
