"use client";

import { useState, useEffect } from "react";
import { Info, Wrench, Code } from "lucide-react";
import ToolCard from "./ToolCard";
import { handleError, hasPermission } from "@/lib/utils";
import { PERMISSIONS } from "@/lib/permissions";
import { api } from "@/lib/api";
import { API_ENDPOINTS, getApiEndpoint } from "@/config/apiEndpoints";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

const tabs = [
  {
    label: "Overview",
    value: "overview",
    icon: <Info className="mr-1 h-4 w-4" />,
  },
  {
    label: "Tools",
    value: "tools",
    icon: <Wrench className="mr-1 h-4 w-4" />,
  },
  //   {
  //     label: "API",
  //     value: "api",
  //     icon: <Code className="mr-1 h-4 w-4" />,
  //   },
];

export default function TabSwitcher() {
  const router = useRouter();
  const { projectId, serverId } = useParams();
  const { data: session } = useSession();
  const token = session?.accessToken || "";
  // const { role } = useRole();
  //   const hasCreateProjectPermission = hasPermission(
  //     role,
  //     PERMISSIONS.CREATE_PROJECT,
  //   );
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [mcpServerData, setMcpServerData] = useState(null);
  const [allMcpServerToolsData, setAllMcpServerToolsData] = useState(null);
  const [expandedCardId, setExpandedCardId] = useState(null);

  useEffect(() => {
    const fetchAllMcpServerData = async () => {
      if (!serverId || !token) {
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(
          getApiEndpoint(API_ENDPOINTS.getAllMcpServerTools, {
            serverId: serverId,
          }),
          {
            "x-project-id": projectId,
            Authorization: `Bearer ${token}`,
          },
        );
        setAllMcpServerToolsData(res);
      } catch (error) {
        handleError("Failed to fetch selected MCP server details", error);
      } finally {
        setLoading(false);
      }
    };

    // if (hasPermission(role, PERMISSIONS.VIEW_SETUP_RBAC)) {
        fetchAllMcpServerData();
    // }

     const fetchgetAllMcpServersData = async () => {
          if (!projectId || !token) {
            return;
          }
    
          try {
            setLoading(true);
            const res = await api.get(
              getApiEndpoint(API_ENDPOINTS.getSelectedMcpServerDetails, {
                server_id: serverId,
              }),
              {
                "x-project-id": projectId,
                Authorization: `Bearer ${token}`,
              },
            );
            setMcpServerData(res);
          } catch (error) {
            handleError("Failed to fetch RBAC setup instructions", error);
          } finally {
            setLoading(false);
          }
        };
    
        // if (hasPermission(role, PERMISSIONS.VIEW_SETUP_RBAC)) {
        fetchgetAllMcpServersData();
        // }
  }, [projectId, token]);

  const handleCardClick = (id) => {
    setExpandedCardId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Tab headers */}
      <div className="sticky top-0 z-10 mr-8 ml-8 flex items-center space-x-10 border-b border-[#E5E7EB] bg-white">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`font-inter relative -mb-[1px] border-b-2 pb-2 text-[14px] cursor-pointer leading-[16px] font-normal ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-[#454545]"
              }`}
            >
              <span className="flex items-center space-x-2">
                {tab.icon}
                <span>{tab.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {activeTab === "overview" && (
          <p className="font-inter self-stretch text-base leading-7 whitespace-wrap break-words font-normal text-[#454545]">
          {mcpServerData?.description}
          </p>
        )}

        {activeTab === "tools" && (
          <div>
            {allMcpServerToolsData?.items?.map((tool) => (
              <ToolCard
                key={tool.id}
                id={tool.id}
                name={tool.name}
                description={tool.description}
                icon={tool.icon}
                status={tool.status}
                onClick={() => handleCardClick(tool.id)}
                isToolCardExpanded={expandedCardId === tool.id}
                setIsToolCardExpanded={(value) => {
                  if (!value) {
                    setExpandedCardId(null);
                  } else {
                    setExpandedCardId(tool.id);
                  }
                }}
              />
            ))}
          </div>
        )}

        {/* {activeTab === "api" && (
          <p className="font-inter self-stretch text-base leading-7 font-normal text-[#454545]">
            API docs coming soon...
          </p>
        )} */}
      </div>
    </div>
  );
}
