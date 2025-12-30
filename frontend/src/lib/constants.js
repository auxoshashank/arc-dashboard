import { Icons } from "@/components/Icons";
import { PERMISSIONS } from "./permissions";

export const NEW_SOLUTION_OPTIONS = {
  QUICK_START: "QUICK_START",
  CUSTOM: "CUSTOM",
};

export const AGENT_CONFIG_DATA = {
  data: {
    nodes: [
      {
        id: "node-1",
        type: "customInput",
        nodeType: "input",
        title: "User Input",
        nodeText: "Text",
        created_at: "2025-03-07T10:00:00Z",
      },
      {
        id: "node-2",
        type: "agent",
        nodeType: "agent",
        title: "Agent",
        nodeText: "Agent",
      },
      {
        id: "node-3",
        type: "customOutput",
        nodeType: "output",
        title: "Output",
        nodeText: "Text",
      },
    ],
    edges: [
      {
        source: "node-1",
        target: "node-2",
        targetHandle: "text-inputs",
      },
      {
        source: "node-2",
        target: "node-3",
      },
    ],
  },
};

export const roleToLabelMap = {
  "damia.org.admin": "Organization Admin",
  "damia.project.builder": "Project Builder",
  "damia.project.operator": "Project Operator",
  "damia.project.admin": "Project Admin",
  "damia.org.reader": "Organization Reader",
};

export const roleToPermissionsMap = {
  "damia.org.admin": new Set([
    PERMISSIONS.VIEW_HOME,
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.VIEW_ROLES,
    PERMISSIONS.VIEW_SETUP_RBAC,
    PERMISSIONS.VIEW_PROJECTS,
  ]),
  "damia.project.admin": new Set([
    PERMISSIONS.VIEW_HOME,
    PERMISSIONS.VIEW_AI_SOLUTIONS,
    PERMISSIONS.VIEW_KNOWLEDGE_BASE,
    PERMISSIONS.VIEW_MODELS,
    PERMISSIONS.VIEW_ROLES,
    PERMISSIONS.CREATE_AI_SOLUTION,
    PERMISSIONS.CREATE_KNOWLEDGE_BASE,
    PERMISSIONS.CREATE_MODELS,
    PERMISSIONS.VIEW_AGENT_CONFIG,
    PERMISSIONS.VIEW_PLAYGROUND,
    PERMISSIONS.VIEW_EVALUATION,
    PERMISSIONS.VIEW_PROJECTS,
    PERMISSIONS.VIEW_MCP_SERVERS,
  ]),
  "damia.project.builder": new Set([
    PERMISSIONS.VIEW_HOME,
    PERMISSIONS.VIEW_AI_SOLUTIONS,
    PERMISSIONS.VIEW_KNOWLEDGE_BASE,
    PERMISSIONS.VIEW_MODELS,
    PERMISSIONS.VIEW_ROLES,
    PERMISSIONS.CREATE_AI_SOLUTION,
    PERMISSIONS.CREATE_KNOWLEDGE_BASE,
    PERMISSIONS.CREATE_MODELS,
    PERMISSIONS.VIEW_AGENT_CONFIG,
    PERMISSIONS.VIEW_PLAYGROUND,
    PERMISSIONS.VIEW_EVALUATION,
    PERMISSIONS.VIEW_PROJECTS,
    PERMISSIONS.VIEW_MCP_SERVERS,
  ]),
  "damia.project.operator": new Set([
    PERMISSIONS.VIEW_HOME,
    PERMISSIONS.VIEW_AI_SOLUTIONS,
    PERMISSIONS.VIEW_ROLES,
    PERMISSIONS.VIEW_PLAYGROUND,
    PERMISSIONS.VIEW_EVALUATION,
    PERMISSIONS.VIEW_PROJECTS,
  ]),
  "damia.org.reader": new Set([
    PERMISSIONS.VIEW_HOME,
    PERMISSIONS.VIEW_PROJECTS,
  ]),
};

export const AGENT_CONFIG_NODES = {
  basic_agent: {
    name: "Basic Agent",
    node_id: "Basic_Agent",
    nodeText: "Basic Agent",
    type: "basic_agent",
    nodeType: "agent",
    isKnowledgeBaseEnabled: true,
    description:
      "This a generic agent template that can be used to create agents with various configurations.",
    instruction: "",
    icon: "",
    tags: ["agents"],
    state: {
      input: "state_name",
      output: "state_name",
    },
    tools: [],
    guardrails: {},
    parameters: {},
    model: {
      model_template_id: "",
      model_template_name: "",
      model_template_type: "",
      parameters: {},
    },
    handles: {
      input: [
        {
          id: "tools-input",
          label: "Tools",
          color: "tools-handle",
        },
        {
          id: "text-inputs",
          label: "Inputs",
          color: "connection-handle",
        },
      ],
      output: [
        {
          id: "agent-output",
          color: "connection-handle",
          label: "Response",
        },
      ],
    },
  },
  router: {
    name: "Routing Agent",
    node_id: "Routing_Agent",
    nodeText: "Routing Agent",
    type: "router",
    nodeType: "agent",
    description:
      "This is a Routing Agent, which consumes agent descriptions and routes the query to appropriate agent/agents",
    instruction: "",
    icon: "",
    isKnowledgeBaseEnabled: false,
    tags: ["agents"],
    state: {
      input: "state_name",
      output: "state_name",
    },
    tools: [],
    guardrails: {},
    parameters: {},
    model: {
      model_template_id: "",
      model_template_name: "",
      model_template_type: "",
      parameters: {},
    },
    handles: {
      input: [
        {
          id: "text-inputs",
          label: "Inputs",
          color: "connection-handle",
        },
      ],
      output: [
        {
          id: "agent-output",
          color: "connection-handle",
          label: "Response",
        },
      ],
    },
  },
  summarizer: {
    name: "Summarization Agent",
    node_id: "Summarization_Agent",
    nodeText: "Summarization Agent",
    type: "summarizer",
    nodeType: "agent",
    description:
      "This is a Summarizing Agent, which consumes agent inputs and summarizes the information.",
    instruction: "",
    icon: "",
    isKnowledgeBaseEnabled: false,
    max_words: 100,
    state: {
      input: "state_name",
      output: "state_name",
    },
    tags: ["agents"],
    tools: [],
    guardrails: {},
    parameters: {
      max_words: {
        label: "Max Words for Summary",
        type: "range",
        data_type: "int",
        user: true,
        tooltip: "Set the max words of the summarized output.",
        value: {
          min: 50,
          max: 10000,
          step: 1,
          default: 100,
        },
      },
    },
    model: {
      model_template_id: "",
      model_template_name: "",
      model_template_type: "",
      parameters: {},
    },
    handles: {
      input: [
        {
          id: "tools-input",
          label: "Tools",
          color: "tools-handle",
        },
        {
          id: "text-inputs",
          label: "Inputs",
          color: "connection-handle",
        },
      ],
      output: [
        {
          id: "agent-output",
          color: "connection-handle",
          label: "Response",
        },
      ],
    },
  },
  orchestrator: {
    name: "Orchestrator Agent",
    node_id: "Orchestartor_Agent",
    nodeText: "Orchestrator Agent",
    type: "orchestrator",
    nodeType: "agent",
    description:
      "This is a Orchestration Agent, which consumes agent descriptions and orchestrates the query. The Orchestration is done for the connected workers. Routing agents cannot be workers.",
    instruction: "",
    icon: "",
    isKnowledgeBaseEnabled: false,
    workers: [],
    tags: ["agents"],
    guardrails: {},
    model: {
      model_template_id: "",
      model_template_name: "",
      model_template_type: "",
      parameters: {},
    },
    handles: {
      input: [
        {
          id: "text-inputs",
          label: "Inputs",
          color: "connection-handle",
        },
        {
          id: "workers-input",
          label: "Workers",
          color: "connection-handle",
        },
      ],
      output: [
        {
          id: "agent-output",
          color: "connection-handle",
          label: "Response",
        },
      ],
    },
  },
};

export const SOLUTION_CONFIG_MENU_OPTIONS = {
  templates: {
    name: "Templates",
    options: [
      {
        id: "workflow-templates",
        comingSoon: true,
        name: "Workflow templates",
        icon: Icons.workflowTemplates,
        options: [
          {
            name: "Q&A Chatbot",
          },
          {
            name: "Testing Assist",
          },
          {
            name: "Dataverse",
          },
        ],
      },
      {
        id: "agent-templates",
        comingSoon: true,
        name: "Agent templates",
        icon: Icons.agentTemplates,
        options: [
          {
            name: "Routing Agent",
          },
          {
            name: "Summarization Agent",
          },
          { name: "Orchestration Agent" },
        ],
      },
      {
        id: "prompt-templates",
        comingSoon: true,
        name: "Prompt templates",
        icon: Icons.promptTemplates,
        options: [{ name: "Q&A Prompt" }],
      },
    ],
  },
  others: {
    name: "Others",
    options: [
      {
        id: "agents",
        name: "Agents",
        icon: Icons.agentTemplates,
        options: [
          AGENT_CONFIG_NODES.basic_agent,
          AGENT_CONFIG_NODES.router,
          AGENT_CONFIG_NODES.summarizer,
          AGENT_CONFIG_NODES.orchestrator,
        ],
      },
      {
        id: "tools",
        name: "Tools",
        icon: Icons.tools,
        options: null,
      },
    ],
  },
};

export const STORE_LINKS = [
  {
    name: "Kimavi",
    description:
      "Multi-agentic application that connects with tools like LinkedIn and ZoomInfo to craft personalized prospecting messages that boost conversions.",
    url: "https://kimavi.com/ai-sdr",
    imageKey: "kimaviLogo",
    metrics: [
      {
        label: "Version",
        value: "1.10.0",
      },
      {
        label: "Last Updated on",
        value: "2025/05/31",
      },
    ],
  },
  {
    name: "Prior Authorization",
    description:
      "AI agent for automating and triaging prior authorizations in healthcare provider workflows.",
    url: "https://damiapa2.azurewebsites.net/",
    imageKey: "priorAuthorizationLogo",
    metrics: [
      {
        label: "Version",
        value: "1.24.2",
      },
      {
        label: "Last Updated on",
        value: "2024/09/30",
      },
    ],
  },
  {
    name: "Contract Management",
    description:
      "Streamline your contract management with AI agents that identify key details, including custom inclusions and exclusions, to improve accuracy and efficiency.",
    url: "https://damia-partssource-dev.azurewebsites.net/",
    imageKey: "contractManagementLogo",
    metrics: [
      {
        label: "Version",
        value: "2.15.0",
      },
      {
        label: "Last Updated on",
        value: "2025/03/31",
      },
    ],
  },
  {
    name: "Sales Copilot",
    description:
      "Conversational AI sales agent for Medicare Advantage, built to support health insurance sales teams.",
    url: "https://yxhy2swnjp.us-east-1.awsapprunner.com/",
    imageKey: "salesCopilotLogo",
    metrics: [
      {
        label: "Version",
        value: "1.0.0",
      },
      {
        label: "Last Updated on",
        value: "2024/08/31",
      },
    ],
  },
  {
    name: "Real World Evidence Assist",
    description:
      "AI agent for opportunity identification that matches products to clients and assists in crafting personalized proposals.",
    url: "https://sales-agent-copilot-axfkbghedzfddte2.canadacentral-01.azurewebsites.net",
    imageKey: "realWorldEvidenceLogo",
    metrics: [
      {
        label: "Version",
        value: "2.3.0",
      },
      {
        label: "Last Updated on",
        value: "2024/12/15",
      },
    ],
  },
  {
    name: "Telemetry Insight Agent",
    description:
      "AI agent for root cause analysis in manufacturing using historical reports and telemetry data.",
    url: "https://si-copilot.azurewebsites.net",
    imageKey: "telemetryInsightLogo",
    metrics: [
      {
        label: "Version",
        value: "1.2.0",
      },
      {
        label: "Last Updated on",
        value: "2025/02/28",
      },
    ],
  },
  {
    name: "Test Case Assist",
    description:
      "Automate software testing with AI agents that generate test cases by analyzing requirement documents, UI mockups, and data models for faster and more accurate validation.",
    url: "https://damia-testing-assist.azurewebsites.net/",
    imageKey: "testingAssistLogo",
    metrics: [
      {
        label: "Version",
        value: "2.1.0",
      },
      {
        label: "Last Updated on",
        value: "2025/01/31",
      },
    ],
  },
  {
    name: "DataVerse",
    description:
      "Interact with complex datasets using AI agents that combine SQL expertise with deep domain understanding to deliver meaningful insights.",
    url: "https://ydetj62fpw.us-east-1.awsapprunner.com",
    imageKey: "dataverseLogo",
    metrics: [
      {
        label: "Version",
        value: "1.20.8",
      },
      {
        label: "Last Updated on",
        value: "2025/05/30",
      },
    ],
  },
  {
    name: "BRD Assist",
    description:
      "A multi-agent workflow that automatically generates detailed requirement documents by synthesizing insights from meeting notes and email communications.",
    url: "https://www.kimavi.com/brd-assist",
    imageKey: "brdAssistLogo",
    metrics: [
      {
        label: "Version",
        value: "1.10.0",
      },
      {
        label: "Last Updated on",
        value: "2025/01/31",
      },
    ],
  },
  {
    name: "Test Execution Assist",
    description:
      "Multi-agent application that augments the testing process for a QA team by using a combination of Data and Computer Use agents to run the tests.",
    url: "http://damia-test-execution-agent.eastus2.azurecontainer.io:8000/",
    imageKey: "brdAssistLogo",
    metrics: [
      {
        label: "Version",
        value: "1.2.0",
      },
      {
        label: "Last Updated on",
        value: "2025/07/01",
      },
    ],
  },
  {
    name: "Kimavi Training Guide Assist",
    description:
      "AI assisted training guide generation that can capture user browser actions and create accurate user guides automatically.",
    url: "https://www.kimavi.com/myvideo?tab=guides&page=1",
    imageKey: "kimaviLogo",
    metrics: [
      {
        label: "Version",
        value: "2.1.0",
      },
      {
        label: "Last Updated on",
        value: "2025/07/31",
      },
    ],
  },
  {
    name: "Conversation Assist",
    description:
      "Conversation AI Application using Damia APIs that allow teams to search across shared enterprise knowledge.",
    url: "https://damia-chat-assist.azurewebsites.net",
    imageKey: "brdAssistLogo",
    metrics: [
      {
        label: "Version",
        value: "1.0.0",
      },
      {
        label: "Last Updated on",
        value: "2025/09/03",
      },
    ],
  },
  {
    name: "Cisco LoA Intelligence",
    description:
      "This agent extracts SKUs, discounts and relevant information from Cisco's LoAs and displays them for user review to be included in the follow-up workflow.",
    url: "https://cisco-loa-intelligence-fgdtdyg2a2amcyh2.canadaeast-01.azurewebsites.net",
    imageKey: "ciscoLogo",
    metrics: [
      {
        label: "Version",
        value: "1.0.0",
      },
      {
        label: "Last Updated on",
        value: "2025/09/11",
      },
    ],
  },
];

export const AGENT_CONFIG_AUTO_SAVE_ENABLED = true;
export const AGENT_CONFIG_AUTO_SAVE_INTERVAL = 15000; // 15 seconds
export const POLL_AI_SOLUTION_CONFIG_INTERVAL = 600;
export const POLL_AI_SOLUTION_TIMEOUT = 120000;

export const LOCAL_STORAGE_KEY = (projectId, solutionId) =>
  `damia-agent-nodes-${projectId}-${solutionId}`;

export const AGENT_CONFIG_INPUT_NODE_ID = "__start__";
export const AGENT_CONFIG_OUTPUT_NODE_ID = "__end__";
