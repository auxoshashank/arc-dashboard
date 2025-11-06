"use client";

import { useState, useRef, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function EllipsisTooltip({ text, className, lines = 1 }) {
  const textRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        setIsOverflowing(
          textRef.current.scrollWidth > textRef.current.clientWidth ||
            textRef.current.scrollHeight > textRef.current.clientHeight,
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div
            ref={textRef}
            className={`cursor-default overflow-hidden text-ellipsis ${className}`}
            style={{
              display: lines > 1 ? "-webkit-box" : "block",
              WebkitLineClamp: lines,
              WebkitBoxOrient: "vertical",
            }}
          >
            {text}
          </div>
        </TooltipTrigger>
        {isOverflowing && (
          <TooltipContent className="max-w-sm break-words">
            <span>{text}</span>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
