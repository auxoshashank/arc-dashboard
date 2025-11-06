"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useUserSessions } from "../hooks/useUserSessions";
import { useSessionHistory } from "..//hooks/useSessionHistory";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // 🔹 Chat states
  const [messages, setMessages] = useState([]);
  const [waiting, setWaiting] = useState(false);
  const [isPlaygroundSidebarOpen, setIsPlaygroundSidebarOpen] = useState(false);

  // 🔹 Session Manager states
  const { data: session } = useSession();
  const token = session?.accessToken || "";
  const userEmail = session?.user?.email || "";
  const [sessionId, setSessionId] = useState("");
  const router = useRouter();
  const { sessionId: routeSessionId } = useParams();

  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
  const solutionId = process.env.NEXT_PUBLIC_SOLUTION_ID;

  const {
    userSessions,
    setUserSessions,
    loading: userSessionsLoading,
  } = useUserSessions(userEmail, solutionId, projectId, token);

  const { sessionHistory, loading: sessionHistoryLoading } = useSessionHistory(
    routeSessionId,
    userEmail,
    projectId,
    token
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps

    if (routeSessionId) {
      setSessionId(routeSessionId);
    }
  }, [setSessionId, userSessions, userSessionsLoading]);

  // 🔹 Start a new session
  const handleStartNewChat = (message) => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setMessages([]);

    setUserSessions((prevSessions) => [
      {
        id: newSessionId,
        createdAt: new Date().toISOString(),
        executionId: "",
        name: "New Chat",
      },
      ...prevSessions,
    ]);

    router.push(
      `/chat/${newSessionId}${message ? `?message=${encodeURIComponent(message)}` : ""}`
    );

    toast.success("New chat started");

    return newSessionId;
  };

  // 🔹 Switch session
  const handleSelectSession = (newSessionId) => {
    setSessionId(newSessionId);
    router.push(`/chat/${newSessionId}`);
  };

  return (
    <ChatContext.Provider
      value={{
        // Chat state
        messages,
        setMessages,
        waiting,
        setWaiting,
        isPlaygroundSidebarOpen,
        setIsPlaygroundSidebarOpen,

        // Session Manager state
        sessionId,
        setSessionId,
        userSessions,
        userSessionsLoading,
        setUserSessions,
        sessionHistory,
        sessionHistoryLoading,
        handleStartNewChat,
        handleSelectSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
