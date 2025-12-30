"use client";

import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
import { Icons } from "./Icons";
import { UserAuth } from "./UserAuth";
import { Separator } from "@/components/ui/separator";
import PlaygroundSidebar from "@/app/chat/[sessionId]/components/PlaygroundSidebar";
import { API_ENDPOINTS, getApiEndpoint } from "@/config/apiEndpoints";
import { useSession } from "next-auth/react";
import { useChatContext } from "@/app/chat/[sessionId]/context/ChatContext";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function Sidebar({ links }) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const title = "Damia";
  const titleImage = Icons.damiaLogo;
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
  const solutionId = process.env.NEXT_PUBLIC_SOLUTION_ID;
  const { data: session } = useSession();
  const user = session?.user;
  const token = session?.accessToken || "";
  const { setMessages, waiting } = useChatContext();

  const {
    handleStartNewChat,
    handleSelectSession,
    sessionId,
    userSessions,
    userSessionsLoading,
    setUserSessions,
    sessionHistoryLoading,
  } = useChatContext(user?.email, solutionId, projectId);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleDeleteSession = async (sessionIdToDelete) => {
    try {
      const endpoint = getApiEndpoint(API_ENDPOINTS.deleteSessionHistory, {
        session_id: sessionIdToDelete,
      });

      await api.delete(endpoint, {
        "x-project-id": projectId,
        Authorization: `Bearer ${token}`,
      });

      // Remove deleted session from state
      const updatedSessions = userSessions.filter(
        (s) => s.id !== sessionIdToDelete
      );
      setUserSessions(updatedSessions);

      // Clear messages if the deleted session was selected
      if (sessionId === sessionIdToDelete) {
        setMessages([]);
      }

      toast.success("Selected chat deleted!");
      router.replace(`/chat`);
    } catch (error) {
      toast.error("Failed to delete session.");
      console.error(error);
    }
  };

  const handleClearAllSessions = async () => {
    try {
      const endpoint = getApiEndpoint(API_ENDPOINTS.deleteUserHistory, {
        user_id: session?.user?.email,
      });

      await api.delete(endpoint, {
        "x-project-id": projectId,
        Authorization: `Bearer ${token}`,
      });

      setUserSessions([]);
      setMessages([]);

      toast.success("All chat history cleared!");
      router.replace(`/chat`);
    } catch (error) {
      toast.error("Failed to clear history.");
      console.error(error);
    }
  };
  return (
    <aside
      className={cn(
        "relative h-screen flex-shrink-0 overflow-hidden border py-4 border-gray-200 bg-[#F5F6F8] transition-all duration-300",
        isCollapsed ? "w-[60px]" : "w-[260px]"
      )}
    >
      {/* Sidebar Content */}
      <div
        className={cn(
          "flex h-full flex-col items-start gap-4",
          isCollapsed && "items-center gap-6"
        )}
      >
        {/* Title Section */}
        <Link href="/" className="flex items-center gap-2 px-4">
          {titleImage &&
            (React.isValidElement(titleImage) ? (
              <span className="h-[24px] w-[22px]">{titleImage}</span>
            ) : typeof titleImage === "function" ? (
              titleImage({ width: 22, height: 24 })
            ) : (
              <Image
                src={titleImage}
                alt="Logo"
                width={100}
                height={32}
                style={{ minWidth: 22, minHeight: 24 }}
              />
            ))}
          {!isCollapsed && (
            <div className="font-inter text-[24px] leading-[130%] font-bold text-[#19213D]">
              {title}
            </div>
          )}
        </Link>
        {/* Collapse Button */}

        {/* Auth + Collapse Button */}
        <div
          className={cn(
            "flex items-center justify-between self-stretch px-4",
            isCollapsed && "flex-col items-center gap-2"
          )}
        >
          <UserAuth collapsed={isCollapsed} />
          <div
            className={`flex items-center justify-end gap-3 ${isCollapsed ? "flex-col" : ""}`}
          >
            {/* {!isCollapsed && <Icons.userSettings />} */}
            <button onClick={toggleCollapse}>
              <Icons.collapseSidebar size={16} />
            </button>
          </div>
        </div>

        <Separator />

        <PlaygroundSidebar
          userSessions={userSessions}
          userSessionsLoading={userSessionsLoading}
          selectedSessionId={sessionId}
          onSelectSession={handleSelectSession}
          onStartNewChat={handleStartNewChat}
          onDeleteSession={handleDeleteSession}
          onClearAllSessions={handleClearAllSessions}
          disableNewChat={
            !user || sessionHistoryLoading || userSessionsLoading || waiting
          }
          isCollapsed={isCollapsed}
        />
      </div>
    </aside>
  );
}
