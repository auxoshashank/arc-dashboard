import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/Icons";

export default function MessageInput({
  onSendMessage,
  disableChatInput,
  placeholder,
  inputFocus,
}) {
  const [message, setMessage] = useState("");
  const textAreaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(message);
      setMessage("");
    }
  };

  useEffect(() => {
    if (inputFocus) {
      textAreaRef.current?.focus();
    }
  }, [inputFocus]);

  return (
    <div className="bg-background flex flex-col items-start self-stretch rounded-[12px] border border-[#E2E8F0]">
      <div className="flex w-full items-center justify-between self-stretch px-4 py-2">
        {/* <div className="flex items-center space-x-2 text-gray-500">
          <Paperclip className="h-4 w-4 cursor-pointer" />
          <Mic className="h-4 w-4 cursor-pointer" />
          <ImageIcon className="h-5 w-5 cursor-pointer" />
        </div>
        <div className="mx-3 h-8 w-px bg-gray-200" /> */}
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="focus-visible:none max-h-64 w-full flex-grow resize-none border-none py-6 text-left shadow-none focus:outline-none"
          onKeyDown={handleKeyDown}
          disabled={disableChatInput}
          resize="none"
          ref={textAreaRef}
        />
        <Button
          className="ml-3 cursor-pointer"
          onClick={() => {
            onSendMessage(message);
            setMessage("");
          }}
          disabled={disableChatInput}
        >
          <Icons.sendIcon className="mr-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
