"use client";

import { Checkbox } from "@/components/ui/checkbox";

export default function SettingCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
        className="h-4 w-4 border-gray-300 rounded"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}
