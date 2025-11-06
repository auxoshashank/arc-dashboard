"use server";

import { API_ENDPOINTS, getApiEndpoint } from "@/config/apiEndpoints";
import { api } from "@/lib/api";

export async function pollInvokeAiSolution(
  executionId,
  { interval = 300, timeout = 120000 } = {},
  projectId,
  token,
) {
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const data = await api.get(
          getApiEndpoint(API_ENDPOINTS.pollInvokeAiSolution, { executionId }),
          {
            Authorization: `Bearer ${token}`,
            "x-project-id": projectId,
          },
        );

        if (data && data.status && data.status?.status === "Completed") {
          return resolve(data);
        }

        if (Date.now() - startTime >= timeout) {
          return reject(new Error("Polling timed out"));
        }

        if (data?.status?.status === "Failed") {
          return reject(new Error("Invocation failed."));
        }

        setTimeout(poll, interval);
      } catch (err) {
        reject(err);
      }
    };

    poll();
  });
}
