"use client";

import { useSigma } from "@react-sigma/core";
import { useCallback } from "react";
import { RotateCwIcon, RotateCcwIcon, SunIcon, MoonIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import LegendPanel from "./LegendPanel";
import { useStaticGraph } from "./UseRandom";
import SettingsPanel from "./SettingPanel";

const ZoomControlTest = ({ dataOpsId }) => {
  const sigma = useSigma();

  const handleRotate = useCallback(() => {
    if (!sigma) return;
    const camera = sigma.getCamera();
    const newAngle = camera.angle + Math.PI / 8;
    camera.animate({ angle: newAngle }, { duration: 200 });
  }, [sigma]);

  const handleRotateCounterClockwise = useCallback(() => {
    if (!sigma) return;
    const camera = sigma.getCamera();
    const newAngle = camera.angle - Math.PI / 8;
    camera.animate({ angle: newAngle }, { duration: 200 });
  }, [sigma]);

  const { legendData } = useStaticGraph(dataOpsId);

  return (
    <div className="flex flex-col gap-[2px] w-[30px]">
      <Button
        variant="ghost"
        onClick={handleRotate}
        className="h-[36px] w-full bg-white hover:bg-gray-200 p-0"
      >
        <RotateCwIcon className="w-4 h-4 text-black" />
      </Button>

      <Button
        variant="ghost"
        onClick={handleRotateCounterClockwise}
        className="h-[36px] w-full bg-white hover:bg-gray-200 p-0"
      >
        <RotateCcwIcon className="w-4 h-4 text-black" />
      </Button>

      {/* Theme toggle button using Tooltip from shadcn */}

      {/* <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              // onClick={toggleTheme}
              className="h-[36px] w-full bg-white hover:bg-gray-200 p-0"
            >
              {isDark ? (
                <MoonIcon className="w-[18px] h-[18px] text-black" />
              ) : (
                <SunIcon className="w-4 h-4 text-black" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            Switch to {isDark ? "light" : "dark"} mode
          </TooltipContent>
        </Tooltip>
      </TooltipProvider> */}


      {/* <SettingsPanel /> */}

      {/* Legend Panel */}
      {legendData && legendData.length > 0 && (
        <LegendPanel dataOpsId={dataOpsId} />
      )}
    </div>
  );
};

export default ZoomControlTest;
