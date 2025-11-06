"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CodeBlock({ text, className }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className={cn("bg-muted relative rounded-md p-4", className)}>
      <Button
        size="icon"
        variant="ghost"
        className="text-muted-foreground absolute top-2 right-2 cursor-pointer"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-4 w-4 text-primary" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
      <pre className="overflow-x-auto text-left text-sm">
        <code className="whitespace-pre-wrap">{text}</code>
      </pre>
    </div>
  );
}
