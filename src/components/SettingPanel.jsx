"use client";

import React, { useRef, useState, useCallback } from "react";
import { SettingsIcon, UndoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

import { useSigmaSettings } from "../store/useStore";
import { serializeSigmaSettings } from "../lib/graphUtils";
import SettingCheckbox from "./SettingCheckbox";

const SettingsPanel = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const {
    showPropertyPanel,
    showSearchBar,
    renderLabels,
    nodeDraggable,
    showEdgeLabel,
    hideUnselectedEdges,
    edgeEvents,
    nodeSize,
    graphLayoutMaxIterations,
    setShowPropertyPanel,
    setShowSearchBar,
    setRenderLabels,
    setNodeDraggable,
    setShowEdgeLabel,
    setHideUnselectedEdges,
    setEdgeEvents,
    setNodeSize,
    minEdgeSize,
    maxEdgeSize,
    setMinEdgeSize,
    setMaxEdgeSize,
    graphQueryMaxDepth,
  } = useSigmaSettings();

  const reset = () => useSigmaSettings.setState({ minEdgeSize: 1, maxEdgeSize: 5 });
  const resetNodes = () => useSigmaSettings.setState({ nodeSize: 100 });

  const setMin = (value) => useSigmaSettings.setState({ minEdgeSize: value });
  const setMax = (value) => useSigmaSettings.setState({ maxEdgeSize: value });

  const setGraphMaxNodes = useCallback((nodes) => {
    if (nodes < 1 || nodes > 1000) return;
    useSigmaSettings.setState({ nodeSize: nodes });
  }, []);

  const setGraphLayoutMaxIterations = useCallback((iterations) => {
    if (iterations < 1) return;
    useSigmaSettings.setState({ graphLayoutMaxIterations: iterations });
  }, []);

  const setGraphQueryMaxDepth = useCallback((depth) => {
    if (depth < 1) return;
    useSigmaSettings.setState({ graphQueryMaxDepth: depth });
  }, []);

  const saveSettings = () => {
    const settings = useSigmaSettings.getState();
    const serializableSettings = serializeSigmaSettings(settings);
    localStorage.setItem("sigmaSettings", JSON.stringify(serializableSettings));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                ref={anchorRef}
                variant="ghost"
                size="icon"
                className="w-full h-[36px] bg-white hover:bg-gray-200 p-0 flex items-center justify-center"
              >
                <SettingsIcon size={16} />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <PopoverContent
        side="left"
        className="w-[220px] max-h-[90vh] overflow-y-auto p-2 rounded-md border bg-white shadow-lg"
      >
        <div className="space-y-2">
          <SettingCheckbox label="Show Property Panel" checked={showPropertyPanel} onChange={setShowPropertyPanel} />
          <SettingCheckbox label="Show Search Bar" checked={showSearchBar} onChange={setShowSearchBar} />

          <Separator />

          <SettingCheckbox label="Show Node Label" checked={renderLabels} onChange={setRenderLabels} />
          <SettingCheckbox label="Node Draggable" checked={nodeDraggable} onChange={setNodeDraggable} />

          <Separator />

          <SettingCheckbox label="Show Edge Label" checked={showEdgeLabel} onChange={setShowEdgeLabel} />
          <SettingCheckbox label="Hide Unselected Edges" checked={hideUnselectedEdges} onChange={setHideUnselectedEdges} />
          <SettingCheckbox label="Edge Events" checked={edgeEvents} onChange={setEdgeEvents} />

          {/* Edge Size Range */}
          <div>
            <Label className="text-sm font-medium">Edge Size Range</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="number"
                min={1}
                max={Math.min(maxEdgeSize, 10)}
                className="w-16 h-8 text-sm border-gray-300 rounded"
                value={minEdgeSize}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!isNaN(val) && val >= 1 && val <= maxEdgeSize) setMin(val);
                }}
              />
              <span className="text-xs">-</span>
              <Input
                type="number"
                min={minEdgeSize}
                max={10}
                className="w-16 h-8 text-sm border-gray-300 rounded"
                value={maxEdgeSize}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!isNaN(val) && val >= minEdgeSize && val <= 10) setMax(val);
                }}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={reset}>
                    <UndoIcon size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Reset</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Max Nodes */}
          <div>
            <Label className="text-sm font-medium">Max Nodes</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="number"
                min={0}
                max={1000}
                className="h-8 text-sm border-gray-300 rounded"
                value={nodeSize}
                onChange={(e) => setGraphMaxNodes(Number(e.target.value))}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={resetNodes}>
                    <UndoIcon size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Reset</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Layout Iterations */}
          <div>
            <Label className="text-sm font-medium">Max Layout Iterations</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="number"
                min={1}
                max={30}
                className="h-8 text-sm border-gray-300 rounded"
                value={graphLayoutMaxIterations}
                onChange={(e) => setGraphLayoutMaxIterations(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Query Depth */}
          <div>
            <Label className="text-sm font-medium">Max Query Depth</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="number"
                min={0}
                max={10000}
                className="h-8 text-sm border-gray-300 rounded"
                value={graphQueryMaxDepth}
                onChange={(e) => setGraphQueryMaxDepth(Number(e.target.value))}
              />
            </div>
          </div>

          <Separator />
          <div className="flex justify-end pt-1">
            <Button onClick={saveSettings} size="sm">Save</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SettingsPanel;
