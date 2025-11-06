import { UndirectedGraph } from "graphology";
import React from "react";

/**
 * Set edge sizes based on the average size of connected nodes.
 */
export const updateEdgeSizesFromNodeSizes = (graph) => {
  graph.forEachEdge((edge) => {
    const [source, target] = graph.extremities(edge);
    const sourceSize = graph.getNodeAttribute(source, "size") || 1;
    const targetSize = graph.getNodeAttribute(target, "size") || 1;
    const edgeSize = (sourceSize + targetSize) / 2;

    graph.setEdgeAttribute(edge, "size", edgeSize);
  });
};

/**
 * Normalize a value to a specified range.
 */
const normalize = (value, min, max, newMin, newMax) => {
  if (max === min) return newMin;
  return newMin + ((value - min) / (max - min)) * (newMax - newMin);
};

/**
 * Normalize edge sizes to a specified range.
 */
export const normalizeEdgeSizes = (graph, minSize = 0.1, maxSize = 10) => {
  const sizes = graph.mapEdges(
    (edge) => graph.getEdgeAttribute(edge, "size") || 1,
  );
  const min = Math.min(...sizes);
  const max = Math.max(...sizes);

  graph.forEachEdge((edge) => {
    const rawSize = graph.getEdgeAttribute(edge, "size") || 1;
    const normalizedSize = normalize(rawSize, min, max, minSize, maxSize);
    graph.setEdgeAttribute(edge, "size", normalizedSize);
  });
};

/**
 * Serialize specific Sigma.js settings from a given state.
 */
export const serializeSigmaSettings = (state) => ({
  allowInvalidContainer: state.allowInvalidContainer,
  defaultNodeType: state.defaultNodeType,
  defaultEdgeType: state.defaultEdgeType,
  renderEdgeLabels: state.renderEdgeLabels,
  labelGridCellSize: state.labelGridCellSize,
  labelRenderedSizeThreshold: state.labelRenderedSizeThreshold,
  enableEdgeEvents: state.enableEdgeEvents,
  labelColor: state.labelColor,
  edgeLabelColor: state.edgeLabelColor,
  edgeLabelSize: state.edgeLabelSize,
  labelSize: state.labelSize,
  showPropertyPanel: state.showPropertyPanel,
  showSearchBar: state.showSearchBar,
  renderLabels: state.renderLabels,
  nodeDraggable: state.nodeDraggable,
  showEdgeLabel: state.showEdgeLabel,
  hideUnselectedEdges: state.hideUnselectedEdges,
  edgeEvents: state.edgeEvents,
  nodeSize: state.nodeSize,
  minEdgeSize: state.minEdgeSize,
  maxEdgeSize: state.maxEdgeSize,
  graphLayoutMaxIterations: state.graphLayoutMaxIterations,
  graphQueryMaxDepth: state.graphQueryMaxDepth,
});

/**
 * Convert layout name string to human-readable format.
 */
export const formatLayoutName = (str) =>
  str
    .replace(/([a-z])([A-Z])/g, "$1 $2") // insert space before capital letters
    .replace(/^./, (c) => c.toUpperCase()); // capitalize first letter

/**
 * Constant values used across the Sigma graph implementation.
 */
export const Constants = {
  labelColorDarkTheme: "#ccc",
  edgeColorDarkTheme: "#888",
  LabelColorHighlightedDarkTheme: "#fff",
  edgeColorHighlighted: "#00f",
  edgeColorSelected: "#f00",
  nodeColorDisabled: "#999",
  nodeBorderColorSelected: "#0f0",
};


export const useIsFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  return isFullscreen;
};
