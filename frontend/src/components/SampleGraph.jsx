"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  useLoadGraph,
  useRegisterEvents,
  useSetSettings,
  useSigma,
} from "@react-sigma/core";
import { useLayoutCirclepack } from "@react-sigma/layout-circlepack";
import { useStaticGraph } from "./UseRandom";
import { useNodeContext } from "../context/NodeContext";
import { useSigmaSettings } from "../store/useStore";
import {
  updateEdgeSizesFromNodeSizes,
  normalizeEdgeSizes,
  Constants,
} from "../lib/graphUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

const displayLabels = {
  file_path: "File Path",
  description: "Description",
  relationship: "Relationship",
  source: "Source",
  target: "Target",
  weight: "Weight",
  data: "Type",
  source_id: "Source ID",
  size: "Size",
  keywords: "Keywords",
};

export const SampleGraph = ({
  disableHoverEffect,
  dataOpsId = null,
  searchQuery,
}) => {
  const { graph: staticGraph } = useStaticGraph(dataOpsId);
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const registerEvents = useRegisterEvents();
  const setSettings = useSetSettings();
  const loadGraph = useLoadGraph();
  const { assign: assignCircular } = useLayoutCirclepack();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const nodeContext = useNodeContext();
  const selectedNode = nodeContext?.selectedNode;
  const setSelectedNode = nodeContext?.setSelectedNode;
  const [temporarilyHiddenNode, setTemporarilyHiddenNode] = useState(null);
  const [hoveredLabel, setHoveredLabel] = useState(null);
  const [hoveredValue, setHoveredValue] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const edgePopupRef = useRef(null);
  const nodePopupRef = useRef(null); // Added ref for node popup

  const isNodePopupVisible =
    (selectedNode || hoveredNode) && !selectedEdge && !hoveredEdge;

  const activeNode = selectedNode || hoveredNode;
  const activeNodeData =
    activeNode && graph.hasNode(activeNode)
      ? graph.getNodeAttributes(activeNode)
      : null;
  const neighbors =
    activeNode && graph.hasNode(activeNode) ? graph.neighbors(activeNode) : [];

  const activeEdge = selectedEdge || hoveredEdge;
  const activeEdgeData =
    activeEdge && graph.hasEdge(activeEdge)
      ? graph.getEdgeAttributes(activeEdge)
      : null;

  const {
    showPropertyPanel,
    hideUnselectedEdges,
    minEdgeSize,
    maxEdgeSize,
    nodeSize,
  } = useSigmaSettings();
  const isNodePanel = !!(showPropertyPanel && isNodePopupVisible && activeNode);

  useEffect(() => {
    if (!staticGraph) return;
    loadGraph(staticGraph);
    assignCircular();

    registerEvents({
      enterNode: ({ node }) => setHoveredNode(node),
      leaveNode: () => setHoveredNode(null),
      clickNode: ({ node }) => {
        setSelectedNode(node);
        setSelectedEdge(null);
        setTemporarilyHiddenNode(selectedEdge);
      },
      clickEdge: ({ edge }) => {
        setTemporarilyHiddenNode(selectedNode);
        setSelectedEdge(edge);
        setSelectedNode(null);
      },
      enterEdge: ({ edge }) => setHoveredEdge(edge),
      leaveEdge: () => setHoveredEdge(null),
    });
  }, [loadGraph, assignCircular, registerEvents, staticGraph]);

  useEffect(() => {
    const focusNode = hoveredNode;
    const focusEdge = hoveredEdge || selectedEdge;

    setSettings({
      enableEdgeEvents: true,
      renderEdgeLabels: true,
      renderLabels: false,

      nodeReducer: (node, data) => {
        const newData = { ...data };
        const visibleNodeSet = new Set(graph.nodes().slice(0, nodeSize));
        if (!visibleNodeSet.has(node)) {
          newData.hidden = true;
          return newData;
        }

        newData.highlighted = false;

        if (!disableHoverEffect) {
          if (focusNode && graph.hasNode(focusNode)) {
            if (
              node === focusNode ||
              graph.neighbors(focusNode).includes(node)
            ) {
              newData.highlighted = true;
              if (node === selectedNode) {
                newData.borderColor = Constants.nodeBorderColorSelected;
              }
            } else {
              newData.color = Constants.nodeColorDisabled;
            }
          } else if (focusEdge && graph.hasEdge(focusEdge)) {
            if (graph.extremities(focusEdge).includes(node)) {
              newData.highlighted = true;
            } else {
              newData.color = Constants.nodeColorDisabled;
            }
          } else if (selectedNode && graph.hasNode(selectedNode)) {
            if (
              node === selectedNode ||
              graph.neighbors(selectedNode).includes(node)
            ) {
              newData.highlighted = true;
              if (node === selectedNode) {
                newData.borderColor = Constants.nodeBorderColorSelected;
              }
            } else {
              newData.color = Constants.nodeColorDisabled;
            }
          } else {
            newData.hidden = false;
            newData.highlighted = false;
            newData.borderColor = undefined;
            newData.color = data.originalColor || data.color;
          }
        }

        return newData;
      },

      edgeReducer: (edge, data) => {
        const [source, target] = graph.extremities(edge);
        const newData = {
          ...data,
          color: Constants.edgeColorDarkTheme,
          hidden: false,
        };

        if (!graph.hasNode(source) || !graph.hasNode(target)) {
          newData.hidden = true;
          return newData;
        }

        if (!disableHoverEffect) {
          if (focusNode && graph.hasNode(focusNode)) {
            if (
              hideUnselectedEdges &&
              !graph.extremities(edge).includes(focusNode)
            ) {
              newData.hidden = true;
            } else if (graph.extremities(edge).includes(focusNode)) {
              newData.color = Constants.edgeColorHighlighted;
            }
          } else if (selectedNode && graph.hasNode(selectedNode)) {
            if (
              hideUnselectedEdges &&
              !graph.extremities(edge).includes(selectedNode)
            ) {
              newData.hidden = true;
            } else if (graph.extremities(edge).includes(selectedNode)) {
              newData.color = Constants.edgeColorHighlighted;
            }
          } else {
            if (edge === selectedEdge) {
              newData.color = Constants.edgeColorSelected;
            } else if (edge === hoveredEdge) {
              newData.color = Constants.edgeColorHighlighted;
            } else if (hideUnselectedEdges) {
              newData.hidden = true;
            }
          }
        }

        return newData;
      },
    });
  }, [
    hoveredNode,
    selectedNode,
    hoveredEdge,
    selectedEdge,
    disableHoverEffect,
    hideUnselectedEdges,
    nodeSize,
    setSettings,
    graph,
  ]);

  useEffect(() => {
    return () => {
      setSelectedNode(null);
      setHoveredNode(null);
      setSelectedEdge(null);
      setHoveredEdge(null);
      setTemporarilyHiddenNode(null);
    };
  }, []);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof WebGL2RenderingContext !== "undefined"
    ) {
      updateEdgeSizesFromNodeSizes(graph);
      normalizeEdgeSizes(graph, minEdgeSize, maxEdgeSize);
      sigma.refresh();
    }
  }, [minEdgeSize, maxEdgeSize, graph, sigma, nodeSize]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (edgePopupRef.current && edgePopupRef.current.contains(event.target)) ||
        (nodePopupRef.current && nodePopupRef.current.contains(event.target))
      ) {
        return;
      }

      setSelectedEdge(null);

      if (temporarilyHiddenNode) {
        setSelectedNode(temporarilyHiddenNode);
        setTemporarilyHiddenNode(null);
      } else {
        setSelectedNode(null);
      }

      setHoveredNode(null);
      setHoveredEdge(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [temporarilyHiddenNode]);

  useEffect(() => {
    if (!graph || !sigma) return;

    // 🔁 Reset everything when searchQuery is empty
    if (!searchQuery || searchQuery.trim() === "") {
      setSelectedNode(null);
      setSelectedEdge(null);
      return;
    }

    const allNodes = graph.nodes();
    const allEdges = graph.edges();
    const lowerTerm = searchQuery.toLowerCase();

    // Try matching node
    const matchedNode = allNodes.find((n) => {
      const label = graph.getNodeAttribute(n, "label") || "";
      return (
        n.toLowerCase().includes(lowerTerm) ||
        label.toLowerCase().includes(lowerTerm)
      );
    });

    if (matchedNode && graph.hasNode(matchedNode)) {
      setSelectedNode(matchedNode);
      setSelectedEdge(null);
      return;
    }

    // Try matching edge
    const matchedEdge = allEdges.find((e) => {
      const label = graph.getEdgeAttribute(e, "label") || "";
      return (
        e.toLowerCase().includes(lowerTerm) ||
        label.toLowerCase().includes(lowerTerm)
      );
    });

    if (matchedEdge && graph.hasEdge(matchedEdge)) {
      setSelectedEdge(matchedEdge);
      setSelectedNode(null);
      return;
    }

    // No match found
    setSelectedNode(null);
    setSelectedEdge(null);
  }, [searchQuery, graph, sigma]);

  const handleCloseEdgePopup = () => {
    setSelectedNode(temporarilyHiddenNode);
    setSelectedEdge(null);
    setHoveredNode(null);
  };

  const handleClosePopup = () => {
    setSelectedNode(null);
    setHoveredNode(null);
    setSelectedEdge(null);
    setTemporarilyHiddenNode(null);
  };

  const renderTruncatedText = (label, value) => {
    const handleMouseEnter = (e) => {
      const rect = e.target.getBoundingClientRect();
      setTooltipPos({
        x: rect.left - 370,
        y: rect.top + window.scrollY,
      });
      setHoveredLabel(label);
      setHoveredValue(value);
    };

    const handleMouseLeave = () => {
      setHoveredLabel(null);
      setHoveredValue(null);
    };

    return (
      <div
        className="group relative max-w-full cursor-default"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <p className="truncate text-sm text-gray-800">
          <span className="font-medium">{label}</span> {value}
        </p>
      </div>
    );
  };

  return (
    <>
      {showPropertyPanel &&
        isNodePopupVisible &&
        activeNode &&
        activeNodeData && (
          <div
            ref={nodePopupRef}
            className="bg-background text-foreground fixed top-18 right-0 z-[1000] max-h-[90vh] max-w-[320px] overflow-y-auto rounded-[12px] p-4 break-words whitespace-normal shadow-[0px_0px_12px_rgba(249,243,243,0.1)]"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-titleColor text-sm font-normal">Node</p>
              <Button variant="ghost" size="icon" onClick={handleClosePopup}>
                <X className="bg-background text-foreground" size={16} />
              </Button>
            </div>

            <Card className="text-foreground mb-2 bg-[#F9F9F9]">
              <CardContent>
                {renderTruncatedText("ID :", activeNode)}
                {renderTruncatedText("Labels :", activeNodeData.label)}
                {renderTruncatedText("Degree :", neighbors.length)}
              </CardContent>
            </Card>

            {activeNodeData.properties && (
              <>
                <p className="text-sectionTitleColor mb-1 text-sm font-normal">
                  Properties
                </p>
                <Card className="text-foreground mb-2 bg-[#F9F9F9]">
                  <CardContent className="p-4">
                    {renderTruncatedText(
                      "Description :",
                      activeNodeData.properties.description,
                    )}
                    {renderTruncatedText(
                      "Name :",
                      activeNodeData.properties.entity_name,
                    )}
                    {renderTruncatedText(
                      "Type :",
                      activeNodeData.properties.entity_type,
                    )}
                    {renderTruncatedText(
                      "Source :",
                      activeNodeData.properties.file_path,
                    )}
                    {renderTruncatedText(
                      "SrcID :",
                      activeNodeData.properties.source_id,
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {neighbors.length > 0 && (
              <>
                <p className="text-relationTitleColor mb-1 text-sm font-normal">
                  Relations (within subgraph)
                </p>
                <Card className="text-foreground bg-[#F9F9F9]">
                  <CardContent className="p-2">
                    <ScrollArea className="max-h-full pr-2">
                      <ul className="space-y-1">
                        {neighbors.map((neighborId) => {
                          const label = graph.getNodeAttribute(
                            neighborId,
                            "label",
                          );
                          return (
                            <li key={neighborId} className="text-sm">
                              <strong>Neigh: </strong> {label}
                            </li>
                          );
                        })}
                      </ul>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

      {showPropertyPanel && activeEdge && activeEdgeData && (
        <div
          ref={edgePopupRef}
          className="bg-background text-foreground fixed top-18 right-0 z-[1000] max-h-[90vh] max-w-[320px] overflow-y-auto rounded-[12px] p-4 break-words whitespace-normal shadow-[0px_0px_12px_rgba(249,243,243,0.1)]"
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="text-titleColor text-sm font-normal">Edge</div>
            {selectedEdge && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleCloseEdgePopup}
              >
                <X className="bg-background text-foreground h-4 w-4" />
              </Button>
            )}
          </div>

          <Card className="text-foreground mb-2 bg-[#F9F9F9]">
            <CardContent>
              {renderTruncatedText("ID :", activeEdgeData.id)}
              {renderTruncatedText("Source :", graph.source(activeEdge))}
              {renderTruncatedText("Target :", graph.target(activeEdge))}
            </CardContent>
          </Card>

          <>
            <p className="text-sectionTitleColor mb-1 text-sm font-normal">
              Properties
            </p>
            <Card className="text-foreground mb-2 bg-[#F9F9F9]">
              <CardContent>
                {Object.entries(activeEdgeData)
                  .filter(
                    ([key]) => !["created_at", "label", "id"].includes(key),
                  )
                  .map(([key, value]) => (
                    <div key={key}>
                      {renderTruncatedText(
                        `${displayLabels[key] ?? key} :`,
                        value ?? "",
                      )}
                    </div>
                  ))}
              </CardContent>
            </Card>
          </>
        </div>
      )}

      {(hoveredEdge || hoveredNode || selectedEdge || selectedNode) &&
        hoveredLabel &&
        hoveredValue && (
          <div
            className={`fixed z-[9999] w-80 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm leading-snug break-words whitespace-normal text-black shadow-xl ${
              isNodePanel ? "ml-4" : "ml-6"
            }`}
            style={{
              top: tooltipPos.y,
              left: tooltipPos.x,
            }}
          >
            <p className="mb-1 font-semibold text-gray-700">{hoveredLabel}</p>
            <p>{hoveredValue}</p>
          </div>
        )}
    </>
  );
};
