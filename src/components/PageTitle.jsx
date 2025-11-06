"use client";

import { useCallback, useState } from "react";
import { Icons } from "./Icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SaveButton from "./SaveButton";
import EllipsisTooltip from "./EllipsisTooltip";
import { handleError } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function PageTitle({
  id,
  projectId,
  title = "",
  description = "",
  icon = "",
  showEditTitle = false,
  onEditTitle = () => {},
}) {
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const router = useRouter();

  const handleSaveTitle = useCallback(async () => {
    try {
      await onEditTitle(id, newTitle, description, icon, projectId);
      setUpdatedTitle(newTitle);
      router.refresh();
    } catch (err) {
      handleError("Failed to update title", err);
      setUpdatedTitle(title);
    } finally {
      setIsEditing(false);
    }
  }, [onEditTitle, newTitle]);

  return (
    <div className="mr-4 flex items-center">
      {!showEditTitle ? (
        <h1 className="text-foreground font-inter text-[24px] leading-[43.56px] font-bold tracking-[-0.045em]">
          {updatedTitle}
        </h1>
      ) : !isEditing ? (
        <>
          <EllipsisTooltip
            text={updatedTitle}
            className="truncate text-sm font-bold"
          />
          <button
            onClick={() => setIsEditing(true)}
            className="cursor-pointer rounded-full p-2 hover:bg-gray-100"
          >
            <Icons.edit className="h-4 w-4" />
          </button>
        </>
      ) : (
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="text"
            placeholder="Title"
            defaultValue={updatedTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Button
            className="!border-primary text-primary hover:text-primary/80 cursor-pointer bg-transparent"
            onClick={() => setIsEditing(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <SaveButton className="cursor-pointer" onSave={handleSaveTitle}>
            Save
          </SaveButton>
        </div>
      )}
    </div>
  );
}
