"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function TypewriterText({ fullText = "", streaming, className }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!streaming) return setDisplayedText(fullText);

    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 10);
    return () => clearInterval(interval);
  }, [fullText, streaming]);

  return (
    <span
      className={cn("inline-flex flex-wrap items-end", className)}
      style={{ wordBreak: "break-word" }}
    >
      <span className="break-words whitespace-pre-line">
        {displayedText}
        {streaming && <ShimmerDot />}
      </span>
    </span>
  );
}

function ShimmerDot() {
  return (
    <span className="bg-primary ml-1 inline-block h-4 w-4 animate-pulse rounded-full" />
  );
}
