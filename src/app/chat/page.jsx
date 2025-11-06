"use client";

import { useState } from "react";
import { homeBreadcrumbs } from "@/app/config";
import { Icons } from "@/components/Icons";
import { useSession } from "next-auth/react";
import Topbar from "@/components/Topbar";
import LoaderSpinner from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatContext } from "./[sessionId]/context/ChatContext";

export default function ChatHome() {
  const { data: session } = useSession();
  const user = session?.user;
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
  const solutionId = process.env.NEXT_PUBLIC_SOLUTION_ID;
  const { handleStartNewChat } = useChatContext(
    user?.email,
    solutionId,
    projectId
  );

  const [inputText, setInputText] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleStartNewChat(inputText);
      setInputText("");
    }
  };

  if (!session) {
    return <LoaderSpinner />;
  }

  return (
    <main className="flex-1 px-0">
      <Topbar
        className="fixed h-16 w-[calc(100%-256px)]"
        breadcrumbs={homeBreadcrumbs}
        searchPlaceholder="Search Solution"
        enableSearch={true}
      />
      <div className="mt-16 h-[calc(100vh-64px)] overflow-y-auto px-20 py-10">
        <div className="flex h-[308px] flex-col items-center justify-center gap-[10px] self-stretch rounded-[16px] border border-[#E3E6EA] bg-white px-[32px] shadow-[0px_2px_4px_0px_rgba(25,33,61,0.08)]">
          <h2 className="text-center text-[22px] leading-[130%] font-medium text-[#19213D]">
            Welcome back, {session.user?.name || "User"}
          </h2>
          <div className="bg-background mt-4 flex w-[600px] flex-col items-start rounded-[16px] border border-[#E2E8F0]">
            <div className="flex w-full items-center justify-between px-4 py-2">
              <div className="flex items-center space-x-2 text-gray-500"></div>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What would you like to do today?"
                className="focus-visible:none flex-grow resize-none border-none py-5 text-left shadow-none focus:outline-none"
              />
              <Button
                className="ml-3 h-12 w-12 p-0"
                onClick={() => {
                  handleStartNewChat(inputText);
                  setInputText("");
                }}
              >
                <Icons.sendIcon className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
