"use server";

import { API_ENDPOINTS } from "@/config/apiEndpoints";
import { api } from "@/lib/api";
import { getTokenFromServerSession } from "@/lib/auth";
import {
  AGENT_CONFIG_INPUT_NODE_ID,
  AGENT_CONFIG_NODES,
  AGENT_CONFIG_OUTPUT_NODE_ID,
} from "@/lib/constants";


export async function createAiSolution(type, projectId, details) {
  if (!details?.name || !details?.description) {
    throw new Error("Name and description are required");
  }

  try {
    const token = await getTokenFromServerSession();

    const res = await api.post(
      API_ENDPOINTS.createAiSolution,
      {
        name: details.name,
        description: details.description,
        project_id: projectId,
        icon: "",
        tags: ["agents"],
        properties: {
          version: "v1.0.0",
          nodes: [
            { ...AGENT_CONFIG_NODES.basic_agent, agent_id: "Q_And_A_Agent" },
          ],
          connections: [
            {
              to: "Q_And_A_Agent",
              from: AGENT_CONFIG_INPUT_NODE_ID,
            },
            {
              to: AGENT_CONFIG_OUTPUT_NODE_ID,
              from: "Q_And_A_Agent",
            },
          ],
          knowledge_id: "",
        },
      },
      {
        "x-project-id": projectId,
        Authorization: `Bearer ${token}`,
      }
    );

    return res;
  } catch (error) {
    console.error("Create AI solution Error:", error);
    throw error;
  }
}
