"use client";

import { cn } from "@/lib/utils";
import { CustomTooltip } from "./CustomTooltip";

export default function TabSwitch({
  tabs = [],
  selectedTabIdx,
  onSelectTab,
  positionAbsolute = false,
  className = "",
}) {
  return (
    <div
      className={cn(
        "z-10 m-3 flex w-fit items-center space-x-2 rounded-lg border-1 bg-white p-2",
        positionAbsolute ? "absolute" : "relative",
        className,
      )}
    >
      {tabs.map((tab, idx) => {
        const { id, Icon, label, disabled } = tab;
        return (
          <button
            key={id}
            onClick={() => onSelectTab(idx)}
            disabled={disabled}
            className={cn(
              `flex cursor-pointer items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-medium transition-all`,
              selectedTabIdx === idx
                ? "bg-sidebar-foreground text-white"
                : "text-gray-600 hover:bg-gray-100",
              disabled ? "cursor-not-allowed text-gray-300" : "",
            )}
          >
            <Icon
              className={cn("h-5 w-5", selectedTabIdx === idx ? "invert" : "")}
              strokecolor={disabled ? "#d1d5dc" : ""}
            />
            <CustomTooltip
              tooltipText="Add Knowledge base for agent to enable Knowledge Graph"
              label={label}
              showTooltip={disabled}
            />
          </button>
        );
      })}
    </div>
  );
}
