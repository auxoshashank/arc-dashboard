import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import MessageCard from "./MessageCard";
import LoaderSpinner from "@/components/Loader";
import { TypingLoader } from "@/components/TypingLoader";

export default function ChatArea({ messages, scrollRef, waiting, loading }) {
  const [openPopupId, setOpenPopupId] = useState(null);

  return loading ? (
    <LoaderSpinner />
  ) : (
    <ScrollArea className="h-full flex-1 overflow-auto" id="chat-area">
      <div ref={scrollRef}>
        {messages.map((msg) => (
          <MessageCard
            key={msg.id}
            id={msg.id}
            msgSenderName={msg.sender}
            msgText={msg.text}
            msgTime={msg.time}
            type={msg.type}
            toolCalls={msg.toolCalls}
            streaming={msg.streaming}
            tokenData={msg.tokenData}
            openPopupId={openPopupId}
            setOpenPopupId={setOpenPopupId}
            error={msg.error}
          />
        ))}
        <ScrollBar orientation="vertical" />
        {waiting ? <TypingLoader /> : null}
      </div>
    </ScrollArea>
  );
}
