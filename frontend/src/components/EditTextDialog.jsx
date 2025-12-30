import { useEffect, useState } from "react";

import CustomDialog from "@/components/CustomDialog";
import { DialogTitle } from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export default function EditTextDialog({
  initialText = "",
  onSave,
  open,
  onOpenChange,
  title,
}) {
  const [draftText, setDraftText] = useState(initialText);

  useEffect(() => {
    if (open) {
      setDraftText(initialText);
    }
  }, [open, initialText]);

  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      className="max-h-[90vh] w-full max-w-[90vw]"
    >
      <div className="flex max-h-[80vh] w-full max-w-[80vw] flex-col gap-4">
        <DialogTitle>
          <Label className="ml-2 text-base font-medium" htmlFor="text-dialog">
            {title}
          </Label>
        </DialogTitle>
        <div className="flex-1 overflow-auto">
          <Textarea
            id="text-dialog"
            rows={8}
            className="border-border h-full max-h-[50vh] min-h-[120px] w-full border-2 text-base break-all"
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            autoFocus
            style={{ resize: "none", wordBreak: "break-all" }}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            Cancel
          </button>
          <button
            className="bg-primary hover:bg-primary/90 rounded px-4 py-2 text-white"
            type="button"
            onClick={() => {
              onSave(draftText);
              onOpenChange(false);
            }}
          >
            Save
          </button>
        </div>
      </div>
    </CustomDialog>
  );
}
