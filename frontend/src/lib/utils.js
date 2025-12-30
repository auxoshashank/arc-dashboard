import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import {
  AGENT_CONFIG_INPUT_NODE_ID,
  AGENT_CONFIG_OUTPUT_NODE_ID,
  LOCAL_STORAGE_KEY,
  roleToPermissionsMap,
} from "./constants";
import DOMPurify from "dompurify";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function goBack(link) {
  if (link) {
    window.location.href = link;
  } else {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  }
}

const AGENT_X_GAP = 350;
const AGENT_Y_BASE = 150;
const AGENT_Y_STEP = 120;

export const getSavedAgentConfigPositionsFromLocalStorage = (
  projectId,
  solutionId,
) => {
  const localStorageKey = LOCAL_STORAGE_KEY(projectId, solutionId);
  let savedPositions = {};
  try {
    const raw = localStorage.getItem(localStorageKey);
    if (raw) {
      const payload = JSON.parse(raw);
      const arr = payload?.nodes || [];
      if (Array.isArray(arr)) {
        savedPositions = arr.reduce((acc, node) => {
          acc[node.id] = node.position;
          return acc;
        }, {});
      }
    }
  } catch (e) {
    // ignore parse errors
  }
  return savedPositions;
};

export const buildGraphData = ({
  agentConfigData = {},
  modelsListLoading,
  modelsList,
  paramsList,
  setSolutionData,
  knowledgeBaseList,
  knowledgeBaseLoading,
  projectId,
  solutionId,
}) => {
  if (
    !Array.isArray(agentConfigData.nodes) ||
    agentConfigData.nodes?.length === 0
  ) {
    return {
      graphNodes: [
        {
          id: AGENT_CONFIG_INPUT_NODE_ID,
          type: "customInput",
          position: { x: 0, y: 100 },
          data: { nodeType: "input" },
        },
        {
          id: AGENT_CONFIG_OUTPUT_NODE_ID,
          type: "customOutput",
          position: { x: 600, y: 100 },
          data: { nodeType: "output" },
        },
      ],
      graphEdges: [],
    };
  }
  let savedPositions = getSavedAgentConfigPositionsFromLocalStorage(
    projectId,
    solutionId,
  );
  const AGENTS_PER_ROW = 6;
  const agentNodes = agentConfigData.nodes.map((agent, idx) => {
    const row = Math.floor(idx / AGENTS_PER_ROW);
    const col = idx % AGENTS_PER_ROW;
    const position = savedPositions[
      agent.agent_id || agent.node_id || `agent-${idx}`
    ] ||
      agent.position || {
        x: 350 + col * AGENT_X_GAP,
        y: AGENT_Y_BASE + row * AGENT_Y_STEP,
      };
    return {
      id: agent.agent_id || agent.node_id || `agent-${idx}`,
      type: agent.nodeType || "agent",
      position,
      data: {
        nodeId: agent.agent_id || agent.node_id || `agent-${idx}`,
        agentConfigData: agent,
        modelsListLoading,
        modelsList,
        paramsList,
        setSolutionData,
        knowledgeBaseList,
        knowledgeBaseLoading,
        projectId,
      },
    };
  });

  const inputNode = {
    id: AGENT_CONFIG_INPUT_NODE_ID,
    type: "customInput",
    position: savedPositions[AGENT_CONFIG_INPUT_NODE_ID] || { x: 0, y: 300 },
    data: { nodeType: "input" },
  };
  const outputNode = {
    id: AGENT_CONFIG_OUTPUT_NODE_ID,
    type: "customOutput",
    position: savedPositions[AGENT_CONFIG_OUTPUT_NODE_ID] || {
      x: 350 + AGENT_X_GAP * Math.min(agentNodes.length, AGENTS_PER_ROW),
      y: 300,
    },
    data: { nodeType: "output" },
  };

  const graphNodes = [inputNode, ...agentNodes, outputNode];
  let graphEdges = [];
  if (
    Array.isArray(agentConfigData.connections) &&
    agentConfigData.connections.length > 0
  ) {
    graphEdges = agentConfigData.connections.map((conn, idx) => {
      const targetNode = graphNodes.find((n) => n.id === conn.to);
      const sourceNode = graphNodes.find((n) => n.id === conn.from);

      let edgeProps = {};
      if (
        targetNode &&
        targetNode.type === "agent" &&
        targetNode.data?.agentConfigData?.type === "orchestrator" &&
        sourceNode &&
        sourceNode.type === "agent"
      ) {
        edgeProps.targetHandle = "workers-input";
      } else if (conn.to.toLowerCase().includes("agent")) {
        edgeProps.targetHandle = "text-inputs";
      }

      return {
        id: `conn-${conn.from}-${conn.to}-${idx}`,
        source: conn.from,
        target: conn.to,
        ...edgeProps,
        animated: false,
      };
    });
  }

  return {
    graphNodes,
    graphEdges,
  };
};

export function replaceParams(template, params) {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key] !== undefined ? String(params[key]) : `{${key}}`;
  });
}

export const handleError = (message, error) => {
  console.error(message, error);
  toast.error(message);
};

export const statusMap = {
  Created: "Processing",
  Started: "Processing",
  Running: "Processing",
  Canceling: "Failed",
  Canceled: "Failed",
  Completed: "Completed",
  Failed: "Failed",
  Managed: "Completed",
  Unknown: "Processing",
  Pending: "Processing",
  Processing: "Processing",
  Processed: "Completed",
};

export const getDisplayStatus = (rawStatus = "") => {
  return statusMap[rawStatus] || "Unknown";
};
export const isProcessingStatus = (status) =>
  getDisplayStatus(status) === "Processing";
export const isCompletedStatus = (status) =>
  getDisplayStatus(status) === "Completed";
export const isFailedStatus = (status) => getDisplayStatus(status) === "Failed";

export function generateChatTitle(messages) {
  if (!messages || messages.length === 0) return "New Chat";

  const recentUserMessages = messages
    .filter((m) => m.sender !== "AI")
    .slice(-3)
    .map((m) => m.text)
    .join(" ");

  const cleaned = recentUserMessages
    .replace(/\s+/g, " ")
    .replace(/[\r\n]+/g, " ")
    .trim();

  if (!cleaned) return "New Chat";

  const maxWords = 10;
  const words = cleaned.split(" ");

  const summary =
    words.length <= maxWords
      ? cleaned
      : words.slice(0, maxWords).join(" ") + "...";

  return summary.charAt(0).toUpperCase() + summary.slice(1);
}

export const getParentPath = (pathname) => {
  const segments = pathname.split("/").filter(Boolean);
  const parentPath = "/" + segments.slice(0, -1).join("/");

  return parentPath;
};

export function getUserPermissions(roles = []) {
  const combined = new Set();
  roles.forEach((role) => {
    const perms = roleToPermissionsMap[role];
    if (perms) {
      perms.forEach((perm) => combined.add(perm));
    }
  });
  return Array.from(combined);
}

export function hasPermission(roles = [], permission, projectId = "") {
  let roleList = [];

  if (Array.isArray(roles)) {
    roleList = roles;
  } else if (
    roles &&
    typeof roles === "object" &&
    roles[projectId] &&
    Array.isArray(roles[projectId])
  ) {
    roleList = roles[projectId];
  }

  return roleList.some((role) => roleToPermissionsMap[role]?.has(permission));
}

export function isValidMarkdown(text) {
  if (typeof text !== "string" || !text.trim()) return false;
  const markdownPattern = /[#*_`>\-\[\]\(\)!]|(\n\s*\n)/;
  return markdownPattern.test(text);
}

export const sanitizeFormData = (formValues) => {
  const sanitized = {};

  const sanitizeNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? null : num;
  };

  for (const key in formValues) {
    let value = formValues[key];

    if (typeof value === "string") {
      value = DOMPurify.sanitize(value.trim());
    }

    if (typeof value === "number") {
      value = sanitizeNumber(value);
    }

    sanitized[key] = value;
  }

  return sanitized;
};

export function isValidHexColor(color) {
  // Matches #RGB, #RRGGBB, #RGBA, or #RRGGBBAA
  const hexRegex =
    /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{8})$/;
  return hexRegex.test(color);
}
