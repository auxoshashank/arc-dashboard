"use client";

import "@react-sigma/core/lib/style.css";
import "@react-sigma/graph-search/lib/style.css";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  ControlsContainer,
  FullScreenControl,
  SigmaContainer,
  ZoomControl,
  useRegisterEvents,
  useSigma,
} from "@react-sigma/core";

import {
  EdgeArrowProgram,
  NodePointProgram,
  NodeCircleProgram,
} from "sigma/rendering";
import { NodeBorderProgram } from "@sigma/node-border";
import EdgeCurveProgram, { EdgeCurvedArrowProgram } from "@sigma/edge-curve";
import ZoomControlTest from "./ZoomControls";
import { useSigmaSettings } from "../store/useStore";
import FocusOnNode from "./FocusOnNode";
import LayoutsControl from "./LayoutControl";
import { SampleGraph } from "./SampleGraph";
import { Icons } from "./Icons";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

const GraphEvents = () => {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();
  const [draggedNode, setDraggedNode] = useState(null);

  useEffect(() => {
    registerEvents({
      downNode: (e) => {
        setDraggedNode(e.node);
        sigma.getGraph().setNodeAttribute(e.node, "highlighted", true);
      },
      mousemovebody: (e) => {
        if (!draggedNode) return;
        const pos = sigma.viewportToGraph(e);
        sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
        sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);
        e.preventSigmaDefault();
        e.original.preventDefault();
        e.original.stopPropagation();
      },
      mouseup: () => {
        if (draggedNode) {
          setDraggedNode(null);
          sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted");
        }
      },
      mousedown: (e) => {
        const mouseEvent = e.original;
        if (mouseEvent.buttons !== 0 && !sigma.getCustomBBox()) {
          sigma.setCustomBBox(sigma.getBBox());
        }
      },
    });
  }, [registerEvents, sigma, draggedNode]);

  return null;
};

export const GraphViewer = ({
  style,
  dataOpsId,
  knowledgeBaseList,
  searchQuery,
}) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [focusNode, setFocusNode] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const selectedKnowledgeBaseId = selectedKnowledgeBase || dataOpsId || null;

  const {
    allowInvalidContainer,
    defaultNodeType,
    edgeLabelSize,
    labelSize,
    renderLabels,
    showEdgeLabel,
    edgeEvents,
    nodeDraggable,
    showSearchBar,
  } = useSigmaSettings();

  useEffect(() => {
    const stored = localStorage.getItem("sigmaSettings");
    if (stored) {
      useSigmaSettings.getState().setMultiple(JSON.parse(stored));
    }
  }, []);

  const filteredKnowledgeBases = (knowledgeBaseList || []).filter(
    (kb) =>
      !searchText ||
      kb.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      kb.id?.toLowerCase().includes(searchText.toLowerCase()),
  );
  const onFocus = useCallback((value) => {
    if (value === null) setFocusNode(null);
    else if (value.type === "nodes") setFocusNode(value.id);
  }, []);

  const onChange = useCallback((value) => {
    if (value === null) setSelectedNode(null);
    else if (value.type === "nodes") setSelectedNode(value.id);
  }, []);

  const postSearchResult = useCallback((options) => {
    return options.length <= 10
      ? options
      : [
          ...options.slice(0, 10),
          {
            type: "message",
            message: (
              <span className="text-muted text-center">
                And {options.length - 10} others
              </span>
            ),
          },
        ];
  }, []);

  return (
    <>
      <SigmaContainer
        settings={{
          allowInvalidContainer,
          defaultNodeType,
          defaultEdgeType: "curvedNoArrow",
          edgeProgramClasses: {
            arrow: EdgeArrowProgram,
            curvedArrow: EdgeCurvedArrowProgram,
            curvedNoArrow: EdgeCurveProgram,
          },
          nodeProgramClasses: {
            default: NodeBorderProgram,
            circel: NodeCircleProgram,
            point: NodePointProgram,
          },
          labelGridCellSize: 60,
          labelRenderedSizeThreshold: 0,
          labelColor: {
            attribute: "labelColor",
          },
          edgeLabelColor: {
            attribute: "labelColor",
          },
          edgeLabelSize,
          labelSize,
          renderLabels,
          renderEdgeLabels: true,
          enableEdgeEvents: edgeEvents,
        }}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          backgroundColor: "#F0F4FF",
          ...style,
        }}
      >
        {!dataOpsId ? (
          <div
            className={cn(
              "absolute top-2.5 left-2.5 z-10 w-78 rounded-lg border border-gray-200 bg-white p-3 shadow-lg transition-all duration-300 ease-in-out",
              isCollapsed ? "h-auto" : "h-[75%]",
            )}
          >
            {/* Collapse Header */}
            <div
              className="flex cursor-pointer items-center p-2 hover:bg-gray-100"
              onClick={() => setIsCollapsed((prev) => !prev)}
            >
              {isCollapsed ? (
                <Icons.agentConfigPanelExpand className="h-5 w-5" />
              ) : (
                <Icons.agentConfigPanelCollapse className="h-5 w-5" />
              )}
              <h2 className="px-2 text-base font-semibold select-none">
                Knowledge Graphs
              </h2>
            </div>

            {/* Collapsible Content */}
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                isCollapsed
                  ? "max-h-0 opacity-0"
                  : "max-h-[1000px] opacity-100",
              )}
            >
              <div className="relative mb-3 text-xs">
                <Icons.search className="absolute top-2 left-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search Knowledge Bases"
                  className="border-border h-8 border-1 pl-10 shadow-none"
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                />
              </div>

              <Separator className="my-3" />

              <div
                className="space-y-1 overflow-y-auto"
                style={{ maxHeight: "calc(75vh - 110px)" }}
              >
                {filteredKnowledgeBases.length === 0 && (
                  <div className="px-2 py-4 text-xs text-gray-400">
                    No knowledge bases found.
                  </div>
                )}
                {filteredKnowledgeBases.map((kb) => (
                  <div
                    key={kb.id}
                    className={cn(
                      "flex cursor-pointer flex-col gap-1 rounded-md px-3 py-2 text-xs hover:bg-gray-100",
                      selectedKnowledgeBaseId === kb.id &&
                        "bg-primary/10 border-primary text-primary border font-semibold",
                    )}
                    onClick={() => {
                      setSelectedKnowledgeBase(kb.id);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {kb.icon && (
                        <img
                          src={`data:image/png;base64,${kb.icon}`}
                          alt={kb.name}
                          className="h-5 w-5 rounded"
                        />
                      )}
                      <span className="font-medium">{kb.name}</span>
                    </div>
                    {Array.isArray(kb.agentNames) &&
                      kb.agentNames.length > 0 && (
                        <div className="ml-7 text-[11px] font-normal text-gray-500">
                          {kb.agentNames.length === 1
                            ? kb.agentNames[0]
                            : kb.agentNames.join(", ")}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
        {knowledgeBaseList && !selectedKnowledgeBaseId && (
          <div className="pointer-events-none absolute top-0 left-0 z-0 flex h-full w-full items-center justify-center">
            <div className="rounded-lg border border-gray-200 bg-white/80 px-8 py-6 text-center shadow-lg">
              <span className="text-lg font-semibold text-gray-700">
                Please select a knowledge base from the list to view the graph.
              </span>
            </div>
          </div>
        )}
        <SampleGraph
          searchQuery={searchQuery}
          {...(selectedKnowledgeBaseId
            ? { dataOpsId: selectedKnowledgeBaseId }
            : {})}
        />
        {nodeDraggable && <GraphEvents />}
        <FocusOnNode node={focusNode ?? selectedNode} />

        <ControlsContainer position="bottom-right mb-10">
          <ZoomControlTest dataOpsId={selectedKnowledgeBaseId} />
          <ZoomControl />
          <FullScreenControl />
          <LayoutsControl />
        </ControlsContainer>
      </SigmaContainer>
    </>
  );
};
