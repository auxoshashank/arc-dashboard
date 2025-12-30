import ReactMarkdown from "react-markdown";
import { MESSAGE_TYPES } from "@/app/config";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, isValidMarkdown } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import { Icons } from "@/components/Icons";
import EllipsisTooltip from "@/components/EllipsisTooltip";
import { TypewriterText } from "./TypewriterText";
import React, { useEffect, useState } from "react";
import { PollingTimeoutError } from "../../../hooks/useStreaming";

function StreamingLoader() {
  const [dotCount, setDotCount] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 400);
    return () => clearInterval(interval);
  }, []);
  return (
    <span className="text-primary ml-2 inline-flex animate-pulse items-center gap-1 font-semibold">
      Generating
      <span>
        {".".repeat(dotCount)}
        {" ".repeat(3 - dotCount)}
      </span>
    </span>
  );
}

function AgentUsagePopup({ usageData, open, onClose }) {
  const agentList = usageData?.agent ? Object.values(usageData.agent) : [];

  return open ? (
    <div
      className="absolute right-0 bottom-8 z-20 max-h-51 max-w-82 overflow-hidden rounded-md border bg-white shadow-lg"
      style={{ minWidth: "320px" }}
    >
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="text-custom-node-gray text-xs font-semibold">
          Details
        </span>
        <button
          type="button"
          className="rounded p-1 hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close"
        >
          <Icons.modalClose className="h-6 w-6 cursor-pointer" />
        </button>
      </div>
      <div className="max-h-38 overflow-y-auto px-4">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-white text-xs">
            <tr className="text-custom-node-gray text-left">
              <th className="py-2">Agent</th>
              <th className="py-2">Model</th>
              <th className="py-2">Token Usage</th>
            </tr>
          </thead>
          <tbody>
            {agentList.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-2 text-center text-gray-400">
                  No usage data available
                </td>
              </tr>
            ) : (
              agentList.map((agent, idx) => (
                <tr
                  key={agent.id || idx}
                  className="border-t transition-colors hover:bg-gray-50"
                >
                  <td className="p-2">{agent.name || agent.id}</td>
                  <td className="p-2">{agent.model}</td>
                  <td className="p-2">
                    {agent.token_usage?.total_tokens ?? "-"}
                    <span className="ml-2 text-xs text-gray-400">
                      (input: {agent.token_usage?.input_tokens ?? 0}, output:{" "}
                      {agent.token_usage?.output_tokens ?? 0})
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  ) : null;
}

export default function MessageCard({
  id,
  msgSenderName,
  msgText,
  msgTime,
  type,
  toolCalls,
  streaming,
  tokenData = {},
  openPopupId,
  setOpenPopupId,
  error,
}) {
  if (!msgTime) {
    return null;
  }

  const isSent = type === MESSAGE_TYPES.SENT;
  const usagePopupOpen = openPopupId === id;

  return (
    <Card
      key={id}
      className={cn(
        "mb-4 flex flex-row items-start p-4",
        isSent ? "justify-end border-none shadow-none" : "border"
      )}
    >
      <div
        className={cn(
          "flex w-full flex-col",
          isSent ? "items-end" : "items-start"
        )}
      >
        <MessageHeader senderName={msgSenderName} time={msgTime} />
        <MessageBody
          text={msgText}
          isSent={isSent}
          toolCalls={toolCalls}
          streaming={streaming}
          error={error}
        />
        {!isSent && !!tokenData && Object.keys(tokenData ?? {}).length > 0 ? (
          <div
            className="relative flex w-full justify-end"
            onClick={() => setOpenPopupId(id)}
          >
            <Icons.info className="text-primary h-5 w-5 cursor-pointer" />
            <AgentUsagePopup
              open={usagePopupOpen}
              onClose={() => {
                setOpenPopupId(null);
              }}
              usageData={tokenData}
            />
          </div>
        ) : null}
      </div>
      {isSent && <UserAvatar userName={msgSenderName} />}
    </Card>
  );
}

function MessageHeader({ senderName, time }) {
  return (
    <div className="flex items-center space-x-4">
      <span className="font-semibold">{senderName}</span>
      <Separator
        orientation="vertical"
        className="bg-separator !h-[20px] w-[1px]"
      />
      <span className="text-sm text-gray-500">{time}</span>
    </div>
  );
}

function MessageBody({ text, isSent, toolCalls, streaming, error }) {
  if (error) {
    const showComeBackLater = error instanceof PollingTimeoutError;
    return (
      <div className="flex gap-2 pt-2 text-left">
        {showComeBackLater ? (
          <>
            <Icons.failedRed className="h-5 w-5 flex-shrink-0" />
            The request timed out. Please come back later.
          </>
        ) : (
          <>
            <Icons.failedRed className="h-5 w-5 flex-shrink-0" /> Failed to
            generate response. Try again later.
          </>
        )}
      </div>
    );
  }

  const cleanedText = isSent
    ? text
    : text?.replace(/```(?:markdown)?\n?/g, "")?.replace(/\n?```/g, "");
  const validMarkdown = isValidMarkdown(cleanedText);

  const renderMessageContent = () => {
    if (isSent) {
      return cleanedText;
    }
    if (streaming) {
      return !cleanedText ? (
        <StreamingLoader className="mr-3" />
      ) : (
        <TypewriterText
          fullText={cleanedText}
          streaming={!!streaming}
          className="text-left"
        />
      );
    }
    if (validMarkdown) {
      return (
        <div className="markdown-reset">
          <ReactMarkdown>{cleanedText}</ReactMarkdown>
        </div>
      );
    }
    return <div className="text-left whitespace-pre-wrap">{cleanedText}</div>;
  };

  const renderToolCalls = () => {
    if (
      !toolCalls ||
      typeof toolCalls !== "object" ||
      Object.keys(toolCalls).length === 0 ||
      typeof toolCalls[Object.keys(toolCalls)[0]] !== "object" ||
      Array.isArray(toolCalls[Object.keys(toolCalls)[0]])
    ) {
      return null;
    }

    return (
      <div className="mt-2 flex flex-col gap-2">
        <h2 className="text-sm font-semibold">Tools List:</h2>
        {Object.entries(toolCalls).map(([agentName, timestamps]) =>
          Object.entries(timestamps).map(([timestamp, calls], i) =>
            Array.isArray(calls)
              ? calls.map((call, idx) => (
                  <div
                    key={`${agentName}-${timestamp}-${idx}`}
                    className="mb-2 flex flex-col gap-1 rounded-md bg-gray-100 p-2"
                  >
                    <div className="flex items-center gap-2">
                      <Icons.tools className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-semibold">{call.name}</span>
                      <span className="ml-2 text-xs text-gray-400">
                        {agentName}
                      </span>
                      <span className="ml-2 text-xs text-gray-400">
                        {timestamp}
                      </span>
                    </div>
                    {call.args && (
                      <div className="ml-6 flex flex-wrap gap-2 text-xs text-gray-500">
                        {Object.entries(call.args).map(([key, value]) => (
                          <span key={key}>
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="ml-6 flex items-center gap-2">
                      <Separator
                        orientation="vertical"
                        className="!h-[16px] w-[1px] bg-gray-500"
                      />
                      <EllipsisTooltip
                        text={call.response || "No response"}
                        lines={2}
                        className="w-80 overflow-hidden text-xs whitespace-nowrap text-gray-400"
                      />
                    </div>
                  </div>
                ))
              : null
          )
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "text-custom-node-gray my-2 w-full max-w-full",
        isSent ? "text-right" : ""
      )}
      style={{ wordBreak: "break-word" }}
    >
      <div className="w-full max-w-full break-words">
        {renderMessageContent()}
      </div>
      <div>{renderToolCalls()}</div>
    </div>
  );
}
