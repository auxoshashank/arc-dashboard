"use server";

import { API_ENDPOINTS } from "@/config/apiEndpoints";
import { api } from "@/lib/api";
import { getTokenFromServerSession } from "@/lib/auth";

export async function createModel(payload) {
  try {
    const token = await getTokenFromServerSession();
    const res = await api.post(API_ENDPOINTS.createModel, payload, {
      Authorization: `Bearer ${token}`,
    });
    return res;
  } catch (error) {
    console.error("Failed to create model:", error);
    return { success: false, message: error.message };
  }
}
