import { Icons } from "@/components/Icons";
import gpt from "@/assets/image 53.png";
import { hasPermission } from "@/lib/utils";
import { PERMISSIONS } from "@/lib/permissions";
import { BrainCircuit, Palette } from "lucide-react";

// Dashboard Links Config
export const homeLinks = [
  { name: "Home", href: "/home", img: Icons.homePageIcon },
  { name: "Studio", href: "/studio", img: Icons.studioImage },
  // { name: "Foundry", href: "##", img: Icons.foundryPageIcon, disabled: true },
  { name: "Store", href: "/store", img: Icons.storeImage, disabled: true },
];

export const homeBreadcrumbs = [{ label: "Home", href: "/home" }];

// Studio Links Config
export const studioLinks = [
  { name: "Home", href: "/home", img: Icons.homePageIcon },
  { name: "Studio", href: "/studio", img: Icons.studioImage },
  // { name: "Foundry", href: "##", img: Icons.foundryPageIcon, disabled: true },
  { name: "Store", href: "/store", img: Icons.storeImage, disabled: true },
];

// Breadcrumbs Config
export const breadcrumbs = [{ label: "Studio", href: "/studio" }];

export const storeBreadcrumbs = [{ label: "Store", href: "/store" }];

export const projectsLinks = (id, role) => {
  const hasAISolutionsViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_AI_SOLUTIONS,
  );
  const hasKnowledgeBaseViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_KNOWLEDGE_BASE,
  );
  const hasModelsViewPermission = hasPermission(role, PERMISSIONS.VIEW_MODELS);
  const hasRolesViewPermission = hasPermission(role, PERMISSIONS.VIEW_ROLES);
  const hasMcpServersViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_MCP_SERVERS,
  );

  return [
    ...(hasRolesViewPermission
      ? [
          {
            name: "Role & Permission",
            href: `/studio/projects/${id}/roles`,
            img: <Icons.rolesImage />,
          },
        ]
      : []),
    ...(hasAISolutionsViewPermission
      ? [
          {
            name: "AI Solutions",
            href: `/studio/projects/${id}`,
            img: <Icons.aiSolutionIcon />,
          },
        ]
      : []),
    ...(hasMcpServersViewPermission
      ? [
          {
            name: "MCP Server",
            href: `/studio/projects/${id}/mcp-server`,
            img: <Icons.mcpServerIcon />,
          },
        ]
      : []),
    ...(hasKnowledgeBaseViewPermission
      ? [
          {
            name: "Knowledge Base",
            href: `/studio/projects/${id}/knowledge-base`,
            img: <Icons.studioImage />,
          },
        ]
      : []),
    // ...(hasModelsViewPermission
    //   ? [
    //       {
    //         name: "Models",
    //         href: `/studio/projects/${id}/models`,
    //         img: <Icons.modelImage />,
    //       },
    //     ]
    //   : []),
  ];
};

export const projectsBreadcrumbs = (projectData) => [
  { label: "Studio", href: "/studio" },
  {
    label: projectData.name || "Project",
    href: `/studio/projects/${projectData.id}`,
  },
];

export const modelsLinks = (id, role) => {
  const hasAISolutionsViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_AI_SOLUTIONS,
  );
  const hasKnowledgeBaseViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_KNOWLEDGE_BASE,
  );
  const hasModelsViewPermission = hasPermission(role, PERMISSIONS.VIEW_MODELS);
  const hasRolesViewPermission = hasPermission(role, PERMISSIONS.VIEW_ROLES);
  const hasMcpServersViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_MCP_SERVERS,
  );

  return [
    ...(hasRolesViewPermission
      ? [
          {
            name: "Role & Permission",
            href: `/studio/projects/${id}/roles`,
            img: <Icons.rolesImage />,
          },
        ]
      : []),
    ...(hasAISolutionsViewPermission
      ? [
          {
            name: "AI Solutions",
            href: `/studio/projects/${id}`,
            img: <Icons.aiSolutionIcon />,
          },
        ]
      : []),
    ...(hasMcpServersViewPermission
      ? [
          {
            name: "MCP Server",
            href: `/studio/projects/${id}/mcp-server`,
            img: <Icons.mcpServerIcon />,
          },
        ]
      : []),
    ...(hasKnowledgeBaseViewPermission
      ? [
          {
            name: "Knowledge Base",
            href: `/studio/projects/${id}/knowledge-base`,
            img: <Icons.studioImage />,
          },
        ]
      : []),
    // ...(hasModelsViewPermission
    //   ? [
    //       {
    //         name: "Models",
    //         href: `/studio/projects/${id}/models`,
    //         img: <Icons.modelImage />,
    //       },
    //     ]
    //   : []),
  ];
};

export const modelsBreadcrumbs = (id) => [
  { label: "Studio", href: "/studio" },
  { label: "Models", href: `/studio/projects/${id}/models` },
];

export const rbacLinks = (id, role) => {
  const hasAISolutionsViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_AI_SOLUTIONS,
  );
  const hasKnowledgeBaseViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_KNOWLEDGE_BASE,
  );
  const hasModelsViewPermission = hasPermission(role, PERMISSIONS.VIEW_MODELS);
  const hasRolesViewPermission = hasPermission(role, PERMISSIONS.VIEW_ROLES);
  const hasMcpServersViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_MCP_SERVERS,
  );

  return [
    ...(hasRolesViewPermission
      ? [
          {
            name: "Role & Permission",
            href: `/studio/projects/${id}/roles`,
            img: <Icons.rolesImage />,
          },
        ]
      : []),
    ...(hasAISolutionsViewPermission
      ? [
          {
            name: "AI Solutions",
            href: `/studio/projects/${id}`,
            img: <Icons.aiSolutionIcon />,
          },
        ]
      : []),
    ...(hasMcpServersViewPermission
      ? [
          {
            name: "MCP Server",
            href: `/studio/projects/${id}/mcp-server`,
            img: <Icons.mcpServerIcon />,
          },
        ]
      : []),
    ...(hasKnowledgeBaseViewPermission
      ? [
          {
            name: "Knowledge Base",
            href: `/studio/projects/${id}/knowledge-base`,
            img: <Icons.studioImage />,
          },
        ]
      : []),
    // ...(hasModelsViewPermission
    //   ? [
    //       {
    //         name: "Models",
    //         href: `/studio/projects/${id}/models`,
    //         img: <Icons.modelImage />,
    //       },
    //     ]
    //   : []),
  ];
};

export const rbacBreadcrumbs = (id, projectData) => [
  { label: "Studio", href: "/studio" },
  { label: projectData?.name, href: "/studio" },
  { label: "Role & Permission", href: `/studio/projects/${id}/roles` },
];

// Card Data
export const cardData = [
  {
    icon: gpt,
    title: "o1",
    description: "High intelligence reasoning model",
  },
  {
    icon: gpt,
    title: "GPT-4",
    description: "Advanced conversational AI model",
  },
  {
    icon: gpt,
    title: "Vision AI",
    description: "AI-powered image analysis",
  },
];

// Sample User Data
export const userData = [
  {
    name: "Arvind Pachahara",
    email: "jane.doe@example.com",
    role: "Project Owner",
    lastActive: "12 Aug, 25 ; 12:30 PM",
  },
  {
    name: "Varun Sharma",
    email: "john.smith@randommail.com",
    role: "Contributor",
    lastActive: "12 Aug, 25 ; 12:30 PM",
  },
  {
    name: "Jordan Lee",
    email: "alice.jones@samplemail.com",
    role: "Application User",
    lastActive: "12 Aug, 25 ; 12:30 PM",
  },
];

// Column Config
export const columns = [
  { label: "User Name", key: "name" },
  { label: "Email ID", key: "email" },
  { label: "Role", key: "role" },
  { label: "Last Active On", key: "lastActive" },
];

// Actions for Dropdown
export const actions = [
  { label: "Manage", onClick: (row) => console.log(`Managing ${row.name}`) },
  {
    label: "Copy Email",
    onClick: (row) => navigator.clipboard.writeText(row.email),
  },
  {
    label: "Invite to team",
    onClick: (row) => console.log(`Inviting ${row.name}`),
  },
  {
    label: "Remove",
    onClick: (row) => console.log(`Removing ${row.name}`),
    isDanger: true,
  },
];

export const kgLinks = (projectId, solutionId, role) => {
  const hasAgentConfigViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_AGENT_CONFIG,
  );
  const hasPlaygroundViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_PLAYGROUND,
  );
  const hasEvaluationViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_EVALUATION,
  );

  const sourceFromHome =
    typeof window !== "undefined" &&
    sessionStorage.getItem("source-from-home") === "true"
      ? "?source=home"
      : "";

  return [
    ...(hasAgentConfigViewPermission
      ? [
          {
            name: "Configuration",
            href: `/studio/projects/${projectId}/solutions/${solutionId}`,
            img: <Icons.studioImage />,
          },
        ]
      : []),
    ...(hasPlaygroundViewPermission
      ? [
          {
            name: "Playground",
            href: `/studio/projects/${projectId}/solutions/${solutionId}/playground${sourceFromHome}`,
            img: <Icons.aiSolutionIcon />,
          },
        ]
      : []),
    // ...(hasEvaluationViewPermission
    //   ? [
    //       {
    //         name: "Evaluation",
    //         href: "#",
    //         img: <Icons.aiSolutionIcon />,
    //       },
    //     ]
    //   : []),
    // {
    //   name: "Deployment",
    //   href: "##",
    //   img: <Icons.aiSolutionIcon />,
    // },
  ];
};

export const MESSAGE_TYPES = {
  SENT: "sent",
  RECEIVED: "received",
};

export const SESSION_STORAGE_KEY_SESSION_ID = "damia-sessionId";

export const kgBreadcrumbs = (
  solutionsData,
  projectName,
  projectId,
  solutionId,
) => [
  { label: "Studio", href: "/studio" },
  {
    label: projectName || "Project",
    href: `/studio/projects/${projectId}`,
  },
  {
    label: solutionsData.name || "Project",
    href: `/studio/projects/${projectId}/solutions/${solutionId}`,
  },
];

export const knowledgebaseLinks = (id, role) => {
  const hasAISolutionsViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_AI_SOLUTIONS,
  );
  const hasKnowledgeBaseViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_KNOWLEDGE_BASE,
  );
  const hasModelsViewPermission = hasPermission(role, PERMISSIONS.VIEW_MODELS);
  const hasRolesViewPermission = hasPermission(role, PERMISSIONS.VIEW_ROLES);
  const hasMcpServersViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_MCP_SERVERS,
  );

  return [
    ...(hasRolesViewPermission
      ? [
          {
            name: "Role & Permission",
            href: `/studio/projects/${id}/roles`,
            img: <Icons.rolesImage />,
          },
        ]
      : []),
    ...(hasAISolutionsViewPermission
      ? [
          {
            name: "AI Solutions",
            href: `/studio/projects/${id}`,
            img: <Icons.aiSolutionIcon />,
          },
        ]
      : []),
    ...(hasMcpServersViewPermission
      ? [
          {
            name: "MCP Server",
            href: `/studio/projects/${id}/mcp-server`,
            img: <Icons.mcpServerIcon />,
          },
        ]
      : []),
    ...(hasKnowledgeBaseViewPermission
      ? [
          {
            id: "knowledge-base",
            name: "Knowledge Base",
            href: `/studio/projects/${id}/knowledge-base`,
            img: <Icons.studioImage />,
          },
        ]
      : []),
    // ...(hasModelsViewPermission
    //   ? [
    //       {
    //         name: "Models",
    //         href: `/studio/projects/${id}/models`,
    //         img: <Icons.modelImage />,
    //       },
    //     ]
    //   : []),
  ];
};

export const knowledgebaseBreadcrumbs = (id, projectName) => [
  { label: "Studio", href: "/studio" },
  { label: projectName || "Project", href: `/studio/projects/${id}` },
  { label: "Knowledge Base", href: `/studio/projects/${id}/knowledge-base` },
];

export const knowledgebaseGraphLinks = (id, dataOpsId, role) => {
  const hasAISolutionsViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_AI_SOLUTIONS,
  );
  const hasKnowledgeBaseViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_KNOWLEDGE_BASE,
  );
  const hasModelsViewPermission = hasPermission(role, PERMISSIONS.VIEW_MODELS);
  const hasRolesViewPermission = hasPermission(role, PERMISSIONS.VIEW_ROLES);
  const hasMcpServersViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_MCP_SERVERS,
  );

  return [
    ...(hasRolesViewPermission
      ? [
          {
            name: "Role & Permission",
            href: `/studio/projects/${id}/roles`,
            img: <Icons.rolesImage />,
          },
        ]
      : []),
    ...(hasAISolutionsViewPermission
      ? [
          {
            name: "AI Solutions",
            href: `/studio/projects/${id}`,
            img: <Icons.aiSolutionIcon />,
          },
        ]
      : []),
    ...(hasMcpServersViewPermission
      ? [
          {
            name: "MCP Server",
            href: `/studio/projects/${id}/mcp-server`,
            img: <Icons.mcpServerIcon />,
          },
        ]
      : []),
    ...(hasKnowledgeBaseViewPermission
      ? [
          {
            id: "knowledge-base",
            name: "Knowledge Base",
            href: `/studio/projects/${id}/knowledge-base`,
            img: <Icons.studioImage />,
          },
        ]
      : []),
    // ...(hasModelsViewPermission
    //   ? [
    //       {
    //         name: "Models",
    //         href: `/studio/projects/${id}/models`,
    //         img: <Icons.modelImage />,
    //       },
    //     ]
    //   : []),
  ];
};

export const knowledgebaseGraphBreadcrumbs = (id, dataOpsId, projectName) => [
  { label: "Studio", href: "/studio" },
  { label: projectName || "Project", href: `/studio/projects/${id}` },
  { label: "Knowledge Base", href: `/studio/projects/${id}/knowledge-base` },
];

export const mcpLinks = (id, role) => {
  const hasAISolutionsViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_AI_SOLUTIONS,
  );
  const hasKnowledgeBaseViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_KNOWLEDGE_BASE,
  );
  const hasModelsViewPermission = hasPermission(role, PERMISSIONS.VIEW_MODELS);
  const hasRolesViewPermission = hasPermission(role, PERMISSIONS.VIEW_ROLES);
  const hasMcpServersViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_MCP_SERVERS,
  );

  return [
    ...(hasRolesViewPermission
      ? [
          {
            name: "Role & Permission",
            href: `/studio/projects/${id}/roles`,
            img: <Icons.rolesImage />,
          },
        ]
      : []),
    ...(hasAISolutionsViewPermission
      ? [
          {
            name: "AI Solutions",
            href: `/studio/projects/${id}`,
            img: <Icons.aiSolutionIcon />,
          },
        ]
      : []),
    ...(hasMcpServersViewPermission
      ? [
          {
            name: "MCP Server",
            href: `/studio/projects/${id}/mcp-server`,
            img: <Icons.mcpServerIcon />,
          },
        ]
      : []),
    ...(hasKnowledgeBaseViewPermission
      ? [
          {
            name: "Knowledge Base",
            href: `/studio/projects/${id}/knowledge-base`,
            img: <Icons.studioImage />,
          },
        ]
      : []),
    // ...(hasModelsViewPermission
    //   ? [
    //       {
    //         name: "Models",
    //         href: `/studio/projects/${id}/models`,
    //         img: <Icons.modelImage />,
    //       },
    //     ]
    //   : []),
  ];
};

export const mcpBreadcrumbs = (projectId, projectData) => [
  { label: "Studio", href: "/studio" },
  {
    label: projectData?.name || "Project",
    href: `/studio`,
  },
  {
    label: "MCP Server",
    href: `/studio/projects/${projectId}/mcp-server`,
  },
];

export const mcpServerLinks = (id, role, serverId) => {
  const hasAISolutionsViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_AI_SOLUTIONS,
  );
  const hasKnowledgeBaseViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_KNOWLEDGE_BASE,
  );
  const hasModelsViewPermission = hasPermission(role, PERMISSIONS.VIEW_MODELS);
  const hasRolesViewPermission = hasPermission(role, PERMISSIONS.VIEW_ROLES);
  const hasMcpServersViewPermission = hasPermission(
    role,
    PERMISSIONS.VIEW_MCP_SERVERS,
  );

  return [
    ...(hasRolesViewPermission
      ? [
          {
            name: "Role & Permission",
            href: `/studio/projects/${id}/roles`,
            img: <Icons.rolesImage />,
          },
        ]
      : []),
    ...(hasAISolutionsViewPermission
      ? [
          {
            name: "AI Solutions",
            href: `/studio/projects/${id}`,
            img: <Icons.aiSolutionIcon />,
          },
        ]
      : []),
    ...(hasMcpServersViewPermission
      ? [
          {
            name: "MCP Server",
            href: `/studio/projects/${id}/mcp-server/${serverId}`,
            img: <Icons.mcpServerIcon />,
          },
        ]
      : []),
    ...(hasKnowledgeBaseViewPermission
      ? [
          {
            name: "Knowledge Base",
            href: `/studio/projects/${id}/knowledge-base`,
            img: <Icons.studioImage />,
          },
        ]
      : []),
    // ...(hasModelsViewPermission
    //   ? [
    //       {
    //         name: "Models",
    //         href: `/studio/projects/${id}/models`,
    //         img: <Icons.modelImage />,
    //       },
    //     ]
    //   : []),
  ];
};

export const mcpServerBreadcrumbs = (
  projectId,
  serverId,
  projectData,
  selectedMcpServerData,
) => [
  { label: "Studio", href: "/studio" },
  {
    label: projectData?.name || "Project",
    href: `/studio/projects/${projectId}`,
  },
  {
    label: "MCP Server",
    href: `/studio/projects/${projectId}/mcp-server`,
  },
  {
    label: selectedMcpServerData?.name,
    href: `/studio/projects/${projectId}/mcp-server/${serverId}`,
  },
];

// Settings Links Config
export const settingsLinks = [
  { name: "Theme Config", href: "/settings/theme", img: <Palette size={16} /> },
  {
    name: "Models Config",
    href: "/settings/model",
    img: <BrainCircuit size={16} />,
  },
];

export const themeBreadcrumbs = [
  { label: "Home", href: "/home" },
  { label: "Settings", href: "/settings" },
  {
    label: "Theme Configurations",
    href: "/settings/theme",
  },
];

export const modelBreadcrumbs = [
  { label: "Home", href: "/home" },
  { label: "Settings", href: "/settings" },
  {
    label: "Model Configurations",
    href: "/settings/model",
  },
];

export const mockData = [
  {
    id: "1",
    name: "Context7",
    repo: "@dmaznest/browsercat-mcp-serve",
    description:
      "Fetch up-to-date, version-specific documentation and code examples directly into your prompts. Enhance your coding experience by eliminating.",
    remote: true,
  },
  {
    id: "2",
    name: "GraphBuddy",
    repo: "@neo4j/graph-embed-server",
    description:
      "Visualize and interact with graph-based data in real-time using our high-performance graph rendering engine.",
    remote: true,
  },
];
