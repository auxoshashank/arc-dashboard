"use client";

import { useEffect, useRef, useState } from "react";
import ChatArea from "./components/ChatArea";
import MessageInput from "./components/MessageInput";
import { MESSAGE_TYPES } from "@/app/config";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { createMessageData, parseMessagesFromHistory } from "./util/util";
import { debounce } from "lodash";
import { handleError } from "@/lib/utils";
import { useChatContext } from "./context/ChatContext";
import { useSearchParams, useRouter } from "next/navigation";
import {
  POLL_AI_SOLUTION_CONFIG_INTERVAL,
  POLL_AI_SOLUTION_TIMEOUT,
} from "@/lib/constants";
import useStreaming from "../../hooks/useStreaming";
import { invokeAiSolution } from "@/actions/aiSolution";

export default function Playground() {
  const router = useRouter();
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
  const solutionId = process.env.NEXT_PUBLIC_SOLUTION_ID;
  const { data: session } = useSession();
  const [inputFocus, setInputFocus] = useState(false);
  const user = session?.user;
  const token = session?.accessToken || "";
  const { messages, setMessages, waiting, setWaiting } = useChatContext();
  const {
    userSessions,
    userSessionsLoading,
    setUserSessions,
    sessionHistory,
    sessionHistoryLoading,
  } = useChatContext(user?.email, solutionId, projectId);
  const { startStreaming, streamingStates } = useStreaming(projectId, token, {
    interval: POLL_AI_SOLUTION_CONFIG_INTERVAL,
    timeout: POLL_AI_SOLUTION_TIMEOUT,
  });

  const scrollRef = useRef(null);
  const prevMessagesLength = useRef(messages.length);
  const { sessionId } = useParams();
  const searchParams = useSearchParams();
  const forwadedMessage = searchParams.get("message");

  const scrollToBottom = debounce(() => {
    const chatArea = document
      ?.getElementById("chat-area")
      ?.querySelector("[data-radix-scroll-area-viewport]");
    const el = scrollRef.current;
    if (el && chatArea) {
      chatArea.scroll({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    }
  }, 300);

  const source = searchParams.get("source");

  useEffect(() => {
    const hasSourceFromHome =
      sessionStorage.getItem("source-from-home") === "true";

    if (!source && hasSourceFromHome) {
      const currentUrl = window.location.pathname;
      router.replace(`${currentUrl}?source=home`);
    }
  }, [source, router]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (!url.includes("/playground")) {
        sessionStorage.removeItem("source-from-home");
      }
    };

    window.addEventListener("popstate", () =>
      handleRouteChange(window.location.pathname)
    );

    return () => {
      window.removeEventListener("popstate", () =>
        handleRouteChange(window.location.pathname)
      );
    };
  }, []);

  useEffect(() => {
    setMessages((prevMessages) =>
      prevMessages.flatMap((msg) => {
        if (streamingStates[msg.id]) {
          const state = streamingStates[msg.id];
          if (state && msg.type === MESSAGE_TYPES.RECEIVED) {
            return [
              {
                ...msg,
                text: state.response?.result?.ai?.content || msg.text || "",
                toolCalls:
                  state.response?.result?.agent_tool_calls?.tool_calls ||
                  msg.toolCalls ||
                  {},
                tokenData:
                  state.response?.result?.token_data || msg.tokenData || {},
                streaming: state.streaming,
                error: state.error,
              },
            ];
          } else if (msg.toBeStreamed && state?.response) {
            return [
              createMessageData({
                id: `${state?.response?.id}_human`,
                msgText: state?.response?.params?.query?.message,
                type: MESSAGE_TYPES.SENT,
                sender: user?.name || "You",
                time: msg.createdAt,
                sessionId,
                streaming: false,
              }),
              createMessageData({
                id: `${msg.id}`,
                type: MESSAGE_TYPES.RECEIVED,
                sender: "Damia",
                time: msg.createdAt,
                sessionId,
                error: state.error,
                streaming: state.streaming,
              }),
            ];
          }
        }
        return [msg];
      })
    );
  }, [streamingStates, setMessages, user?.name, sessionId]);

  useEffect(() => {
    if (sessionHistory && !forwadedMessage) {
      const parsedMessages = parseMessagesFromHistory(
        sessionHistory,
        user?.name,
        sessionId
      )
        .flat()
        .filter((msg) => msg !== undefined);

      parsedMessages.forEach((msg) => {
        if (!msg?.toBeStreamed) return;
        if (msg.toBeStreamed) {
          startStreaming(msg.id);
        }
      });

      setMessages(parsedMessages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionHistory, setMessages, user?.name]);

  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      scrollToBottom();
    }
    prevMessagesLength.current = messages.length;
  }, [messages, scrollRef, scrollToBottom]);

  useEffect(() => {
    if (forwadedMessage) {
      handleSendMessage(forwadedMessage, sessionId);
    }
  }, []);

  const clearForwadedMessage = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete("message");
    window.history.replaceState({}, "", currentUrl.toString());
  };

  const handleSendMessage = async (message, sId) => {
    if (message.trim() === "") {
      return;
    }

    let messageSessionId = sId;

    let isFirstMessage = false;

    const currentSessionMessages = messages.filter(
      (msg) => msg.sessionId === messageSessionId
    );
    if (currentSessionMessages.length === 0) {
      isFirstMessage = true;
    }

    setWaiting(true);
    setInputFocus(false);
    setMessages((prevMessages) => [
      ...prevMessages,
      createMessageData({
        id: Date.now(),
        msgText: message,
        type: MESSAGE_TYPES.SENT,
        sender: user?.name || "You",
        time: new Date().toISOString(),
        sessionId: messageSessionId,
      }),
    ]);

    if (isFirstMessage) {
      setUserSessions((prevSessions) =>
        prevSessions.map((s) =>
          s.id === messageSessionId ? { ...s, name: message } : s
        )
      );
    }

    try {
      const invokeStatus = await invokeAiSolution(
        user?.email,
        messageSessionId,
        solutionId,
        message,
        projectId,
        token
      );

      if (invokeStatus?.status?.status === "initialized") {
        startStreaming(invokeStatus?.execution_id);
        setMessages((prevMessages) => [
          ...prevMessages,
          createMessageData({
            id: invokeStatus?.execution_id,
            type: MESSAGE_TYPES.RECEIVED,
            sender: "Damia",
            time: new Date().toISOString(),
            sessionId: messageSessionId,
            streaming: true,
          }),
        ]);
        setInputFocus(true);
      } else {
        handleError("Failed to send message. Please try again.");
      }
    } catch (err) {
      handleError("Error in invoking AI solution. Please try again.", err);
    } finally {
      clearForwadedMessage();
      setWaiting(false);
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      <main className="flex flex-1 flex-col bg-cover bg-center p-4">
        <ChatArea
          loading={sessionHistoryLoading}
          waiting={waiting}
          messages={messages}
          scrollRef={scrollRef}
        />
        <MessageInput
          disableChatInput={
            waiting ||
            !user ||
            sessionHistoryLoading ||
            userSessionsLoading ||
            Object.keys(streamingStates).some(
              (key) => streamingStates[key]?.streaming
            )
          }
          placeholder={
            user
              ? "Type your message here..."
              : "Please log in to send messages."
          }
          onSendMessage={(message) => handleSendMessage(message, sessionId)}
          inputFocus={inputFocus}
        />
      </main>
    </div>
  );
}
