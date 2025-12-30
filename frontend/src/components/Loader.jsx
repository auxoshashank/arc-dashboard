"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function LoaderSpinner({
  className,
  loadingText = "Loading...",
}) {
  return (
    <div
      className={cn(
        "flex h-screen w-full items-center justify-center",
        className,
      )}
    >
      <div className="border-t-primary h-8 w-8 animate-spin rounded-full border-4 border-gray-300" />
      <span className="text-muted-foreground ml-2 text-sm">{loadingText}</span>
    </div>
  );
}
