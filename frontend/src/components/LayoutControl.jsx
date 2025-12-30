"use client";

import { useSigma } from "@react-sigma/core";
import { useLayoutCirclepack } from "@react-sigma/layout-circlepack";
import { useLayoutCircular } from "@react-sigma/layout-circular";
import {
  useLayoutForce,
  useWorkerLayoutForce,
} from "@react-sigma/layout-force";
import {
  useLayoutForceAtlas2,
  useWorkerLayoutForceAtlas2,
} from "@react-sigma/layout-forceatlas2";
import {
  useLayoutNoverlap,
  useWorkerLayoutNoverlap,
} from "@react-sigma/layout-noverlap";
import { useLayoutRandom } from "@react-sigma/layout-random";
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { FaProjectDiagram } from "react-icons/fa";
import { animateNodes } from "sigma/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSigmaSettings } from "../store/useStore";
import { formatLayoutName, useIsFullscreen } from "../lib/graphUtils";
import { GripIcon, PlayIcon, PauseIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";

const WorkerLayoutControl = ({ layout, autoRunFor, mainLayout }) => {
  const sigma = useSigma();
  const [isRunning, setIsRunning] = useState(false);
  const animationTimerRef = useRef(null);

  const updatePositions = useCallback(() => {
    if (!sigma) return;

    try {
      const graph = sigma.getGraph();
      if (!graph || graph.order === 0) return;

      const positions = mainLayout.positions();
      animateNodes(graph, positions, { duration: 300 });
    } catch (error) {
      console.error("Error updating positions:", error);
      if (animationTimerRef.current) {
        window.clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
        setIsRunning(false);
      }
    }
  }, [sigma, mainLayout]);

  const handleClick = useCallback(() => {
    if (isRunning) {
      if (animationTimerRef.current) {
        window.clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
      }

      try {
        if (typeof layout.kill === "function") {
          layout.kill();
        } else if (typeof layout.stop === "function") {
          layout.stop();
        }
      } catch (error) {
        console.error("Error stopping layout algorithm:", error);
      }

      setIsRunning(false);
    } else {
      updatePositions();
      animationTimerRef.current = window.setInterval(() => {
        updatePositions();
      }, 200);

      setIsRunning(true);

      setTimeout(() => {
        if (animationTimerRef.current) {
          window.clearInterval(animationTimerRef.current);
          animationTimerRef.current = null;
          setIsRunning(false);
          try {
            if (typeof layout.kill === "function") {
              layout.kill();
            } else if (typeof layout.stop === "function") {
              layout.stop();
            }
          } catch (error) {
            console.error("Error stopping layout algorithm:", error);
          }
        }
      }, 3000);
    }
  }, [isRunning, layout, updatePositions]);

  useEffect(() => {
    if (!sigma) return;

    let timeout = null;

    if (
      autoRunFor !== undefined &&
      autoRunFor > -1 &&
      sigma.getGraph().order > 0
    ) {
      updatePositions();
      animationTimerRef.current = window.setInterval(() => {
        updatePositions();
      }, 200);

      setIsRunning(true);

      if (autoRunFor > 0) {
        timeout = window.setTimeout(() => {
          if (animationTimerRef.current) {
            window.clearInterval(animationTimerRef.current);
            animationTimerRef.current = null;
          }
          setIsRunning(false);
        }, autoRunFor);
      }
    }

    return () => {
      if (animationTimerRef.current) {
        window.clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
      }
      if (timeout) {
        window.clearTimeout(timeout);
      }
      setIsRunning(false);
    };
  }, [autoRunFor, sigma, updatePositions]);


  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleClick}
          className="w-full h-9 bg-white hover:bg-gray-200 text-black flex items-center justify-center rounded cursor-pointer"
        >
          {isRunning ? (
            <PauseIcon className="mb-[5px] w-[18px] h-[18px] text-black" />
          ) : (
            <PlayIcon className="mb-[5px] w-[18px] h-[18px] text-black" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="z-[1000] pl-2" side="right">
        {isRunning ? "Stop Animation" : "Start Animation"}
      </TooltipContent>
    </Tooltip>
  );
};

const LayoutsControl = () => {
  const sigma = useSigma();
  const isDark = false;
  const { graphLayoutMaxIterations } = useSigmaSettings();
  const [layout, setLayout] = useState(() => {
    const storedLayout = localStorage.getItem("graph-layout");
    return storedLayout || "circular";
  });
  const [opened, setOpened] = useState(false);

  const layoutCircular = useLayoutCircular();
  const layoutCirclepack = useLayoutCirclepack();
  const layoutRandom = useLayoutRandom();
  const layoutNoverlap = useLayoutNoverlap({
    maxIterations: Number(graphLayoutMaxIterations),
    settings: {
      margin: 5,
      expansion: 1.1,
      gridSize: 1,
      ratio: 1,
      speed: 3,
    },
  });
  const layoutForce = useLayoutForce({
    maxIterations: Number(graphLayoutMaxIterations),
    settings: {
      attraction: 0.0003,
      repulsion: 0.02,
      gravity: 0.02,
      inertia: 0.4,
      maxMove: 100,
    },
  });
  const layoutForceAtlas2 = useLayoutForceAtlas2({
    iterations: Number(graphLayoutMaxIterations),
  });

  const workerNoverlap = useWorkerLayoutNoverlap();
  const workerForce = useWorkerLayoutForce();
  const workerForceAtlas2 = useWorkerLayoutForceAtlas2();

  const layouts = useMemo(() => {
    return {
      circular: {
        layout: layoutCircular,
      },
      circlepack: {
        layout: layoutCirclepack,
      },
      random: {
        layout: layoutRandom,
      },
      noverlaps: {
        layout: layoutNoverlap,
        worker: workerNoverlap,
      },
      forceDirected: {
        layout: layoutForce,
        worker: workerForce,
      },
      forceAtlas: {
        layout: layoutForceAtlas2,
        worker: workerForceAtlas2,
      },
    };
  }, [
    layoutCirclepack,
    layoutCircular,
    layoutForce,
    layoutForceAtlas2,
    layoutNoverlap,
    layoutRandom,
    workerForce,
    workerNoverlap,
    workerForceAtlas2,
  ]);

  const runLayout = useCallback(
    (newLayout) => {
      const { positions } = layouts[newLayout].layout;

      try {
        const graph = sigma.getGraph();
        if (!graph) return;

        const pos = positions();
        animateNodes(graph, pos, { duration: 400 });
      } catch (error) {
        console.error("Error running layout:", error);
      }
    },
    [layouts, sigma],
  );

  useEffect(() => {
    const close = () => {
      setOpened(false);
    };
    if (opened === true) {
      setTimeout(() => document.addEventListener("click", close), 0);
    }
    return () => document.removeEventListener("click", close);
  }, [opened]);


  const isFullscreen = useIsFullscreen();
  const fullscreenRef = useRef(null);

  // Close when clicking outside in fullscreen mode
  useEffect(() => {
    if (!isFullscreen || !opened) return;

    const handleClickOutside = (e) => {
      if (fullscreenRef.current && !fullscreenRef.current.contains(e.target)) {
        setOpened(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFullscreen, opened]);

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    runLayout(newLayout);
    localStorage.setItem("graph-layout", newLayout);
  };

  return (
    <>
      <div>
        {layouts[layout] && "worker" in layouts[layout] && (
          <WorkerLayoutControl
            layout={layouts[layout].worker}
            mainLayout={layouts[layout].layout}
          />
        )}
      </div>
      <div className="relative react-sigma-control">
        <Popover open={opened} onOpenChange={setOpened}>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost">
              <FaProjectDiagram />
            </Button>
          </PopoverTrigger>

          {opened && Object.keys(layouts).length > 0 && (
            isFullscreen ? (
              <div
                ref={fullscreenRef}
                className={`absolute bottom-6 right-10 p-0 w-[150px] z-[1000] border ${isDark ? "bg-background" : "bg-muted"}`}
              >
                <Card className="rounded-none shadow-md w-full">
                  <ul className="divide-y text-sm">
                    {Object.keys(layouts).map((key) => (
                      <li key={key}>
                        <button
                          className={`w-full text-center px-1 py-1 hover:bg-accent transition ${layout === key ? "bg-accent font-semibold" : ""}`}
                          onClick={() => {
                            handleLayoutChange(key);
                            setOpened(false);
                          }}
                        >
                          {formatLayoutName(key)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            ) : (
              <PopoverContent
                side="right"
                align="center"
                sideOffset={8}
                className={`p-0 w-[150px] z-[1000] border ${isDark ? "bg-background" : "bg-muted"}`}
              >
                <Card className="rounded-none shadow-md w-full">
                  <ul className="divide-y text-sm">
                    {Object.keys(layouts).map((key) => (
                      <li key={key}>
                        <button
                          className={`w-full text-center px-1 py-1 hover:bg-accent transition ${layout === key ? "bg-accent font-semibold" : ""}`}
                          onClick={() => {
                            handleLayoutChange(key);
                            setOpened(false);
                          }}
                        >
                          {formatLayoutName(key)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </Card>
              </PopoverContent>
            )
          )}
        </Popover>
      </div>
    </>
  );
};

export default LayoutsControl;
