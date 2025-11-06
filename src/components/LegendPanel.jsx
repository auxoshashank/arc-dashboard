"use client";

import React, { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react"; // Replaces MUI InfoIcon
import { useStaticGraph } from "./UseRandom";
import { formatLayoutName, useIsFullscreen } from "../lib/graphUtils";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";



const LegendPanel = ({ dataOpsId }) => {
  const [legendOpen, setLegendOpen] = useState(false);
  const legendAnchorRef = useRef(null);
  const { legendData } = useStaticGraph(dataOpsId);
  const isFullscreen = useIsFullscreen();
  const fullscreenLegendRef = useRef(null);

  useEffect(() => {
    if (!isFullscreen || !legendOpen) return;

    const handleClickOutside = (event) => {
      if (
        fullscreenLegendRef.current &&
        !fullscreenLegendRef.current.contains(event.target)
      ) {
        setLegendOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFullscreen, legendOpen]);

  return (

    <Popover open={legendOpen} onOpenChange={setLegendOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              onClick={() => setLegendOpen((prev) => !prev)}
              variant="ghost"
              size="icon"
              className="w-full h-9 bg-white flex items-center justify-center cursor-pointer z-[1000] hover:bg-gray-200"
            >
              <Info className="mb-[5px] w-[18px] h-[18px] text-black" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent className="z-[99999] pl-2" side="right">Show Legend</TooltipContent>
      </Tooltip>

      {legendOpen && legendData && legendData.length > 0 && (
        isFullscreen ? (
          <div
            ref={fullscreenLegendRef}
            className="absolute top-16 right-10 w-[200px] bg-white p-2 pl-6 shadow-md z-[10000]"
          >
            <div className="text-sm font-semibold mb-2">Legend</div>
            {legendData.map((item) => (
              <div key={item.type} className="flex items-center mb-1">
                <div
                  className="w-3 h-3 rounded-[70%] mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm">{formatLayoutName(item.type)}</span>
              </div>
            ))}
          </div>
        ) : (
          <PopoverContent
            side="right"
            align="center"
            sideOffset={10}
            className="w-[200px] max-w-sm p-2 pl-5 z-[1000] shadow-md"
          >
            <div className="text-sm font-semibold mb-2">Legend</div>
            {legendData.map((item) => (
              <div key={item.type} className="flex items-center mb-1">
                <div
                  className="w-3 h-3 rounded-[70%] mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm">{formatLayoutName(item.type)}</span>
              </div>
            ))}
          </PopoverContent>
        )
      )}
    </Popover>

  );
};

export default LegendPanel;
