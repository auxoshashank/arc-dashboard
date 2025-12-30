"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SaveButton({ onSave, children, className }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onSave();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={cn("cursor-poiner", className)}
      disabled={loading}
      onClick={handleClick}
    >
      {loading ? "Saving..." : children}
    </Button>
  );
}
