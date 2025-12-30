import { MESSAGE_TYPES } from "@/app/config";
import { LOCAL_STORAGE_KEY } from "@/lib/constants";

export const createMessageData = ({
  id,
  msgText,
  type,
  sender,
  time,
  toolCalls,
  sessionId,
  streaming = false,
  tokenData = {},
  error,
}) => {
  const dateObj = new Date(time);
  const today = new Date();
  const isToday =
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear();

  const formattedTime = isToday
    ? dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : `${dateObj.toISOString().slice(0, 10)} ${dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;

  return {
    id,
    text: msgText,
    type,
    sender,
    time: formattedTime,
    toolCalls: toolCalls || {},
    sessionId,
    streaming,
    tokenData,
    error,
  };
};

export const parseMessagesFromHistory = (history, userName, sessionId) => {
  if (!history || !Array.isArray(history)) {
    return [];
  }

  return history?.map((msg) => {
    if (msg.result) {
      const humanMessage = msg.result?.human?.content || "";
      const aiMessage = msg.result?.ai?.content || "";
      return [
        createMessageData({
          id: `${msg.execution_id}_human`,
          msgText: humanMessage,
          type: MESSAGE_TYPES.SENT,
          sender: userName || "You",
          time: msg.created_at,
          sessionId,
        }),
        createMessageData({
          id: `${msg.result?.ai?.id}`,
          msgText: aiMessage,
          type: MESSAGE_TYPES.RECEIVED,
          sender: "Damia",
          time: msg.created_at,
          toolCalls: msg.result?.agent_tool_calls?.tool_calls || {},
          sessionId,
          tokenData: msg.result?.token_data || {},
        }),
      ];
    } else {
      return {
        id: msg.execution_id,
        createdAt: msg.created_at,
        toBeStreamed: true,
      };
    }
  });
};

export const buildAgentConfigDataFromSolutionData = (solutionData) => {
  if (
    !solutionData ||
    !Array.isArray(solutionData?.properties?.nodes) ||
    solutionData.properties.nodes.length === 0
  ) {
    return null;
  }

  return {
    nodes: [...solutionData.properties.nodes],
    knowledge_id: solutionData.properties?.knowledge_id || "",
    connections: Array.isArray(solutionData.properties.connections)
      ? [...solutionData.properties.connections]
      : [],
  };
};

export const buildSolutionProperties = (solutionData, updatedData) => {
  if (
    !solutionData ||
    !Array.isArray(solutionData?.properties?.nodes) ||
    !updatedData
  ) {
    return null;
  }

  const nodes = Array.isArray(updatedData.agents)
    ? updatedData.agents.map((agent) => ({ ...agent }))
    : [...solutionData.properties.nodes];

  const connections = Array.isArray(updatedData.connections)
    ? [...updatedData.connections]
    : solutionData.properties.connections || [];

  return {
    properties: {
      ...solutionData.properties,
      nodes,
      connections,
    },
  };
};

function hasSubtree(nodeId, edges, orchestratorId) {
  return edges.some(
    (edge) =>
      (edge.source === nodeId && edge.target !== orchestratorId) ||
      (edge.target === nodeId && edge.targetHandle !== "tools-input"),
  );
}

export function hasInvalidOrchestratorConnections(nodes, edges) {
  const orchestratorNodes = nodes.filter(
    (n) =>
      n.type === "agent" && n.data?.agentConfigData?.type === "orchestrator",
  );

  if (orchestratorNodes.length === 0) return false;
  return orchestratorNodes.some((orchestrator) => {
    const connectedEdges = edges.filter(
      (e) => e.target === orchestrator.id && e.targetHandle === "workers-input",
    );
    return connectedEdges.some((edge) =>
      hasSubtree(edge.source, edges, orchestrator.id),
    );
  });
}

export const saveAgentConfigPositions = (
  nodes,
  projectId,
  solutionId,
  initialized = true,
  expiryMinutes = 5000,
) => {
  if (!initialized || typeof localStorage === "undefined") {
    return;
  }
  const key = LOCAL_STORAGE_KEY(projectId, solutionId);
  const expiresAt = Date.now() + expiryMinutes * 60 * 1000;
  const nodesToSave = nodes.map((node) => ({
    id: node.id,
    position: node.position,
  }));
  const payload = {
    expiresAt,
    nodes: nodesToSave,
  };
  localStorage.setItem(key, JSON.stringify(payload));
  cleanupExpiredAgentConfigKeys();
};

export const cleanupExpiredAgentConfigKeys = () => {
  if (typeof localStorage === "undefined") return;
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("damia-agent-nodes-")) {
      try {
        const payload = JSON.parse(localStorage.getItem(key));
        if (payload?.expiresAt && payload.expiresAt < Date.now()) {
          localStorage.removeItem(key);
        }
      } catch (e) {
        // ignore parse errors
      }
    }
  });
};
