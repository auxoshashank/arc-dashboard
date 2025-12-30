// src/store/useSigmaSettings.js
import { create } from "zustand";
import { EdgeArrowProgram, NodePointProgram, NodeCircleProgram } from 'sigma/rendering';
import { NodeBorderProgram } from '@sigma/node-border';
import EdgeCurveProgram, { EdgeCurvedArrowProgram } from '@sigma/edge-curve';

export const useSigmaSettings = create((set) => ({
    allowInvalidContainer: true,
    defaultNodeType: "default",
    defaultEdgeType: "curvedNoArrow",
    renderEdgeLabels: true,
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
    labelRenderedSizeThreshold: 12,
    enableEdgeEvents: true,
    labelColor: {
        color: "#ccc",
        attribute: "labelColor",
    },
    edgeLabelColor: {
        color: "#ccc",
        attribute: "labelColor",
    },
    edgeLabelSize: 12,
    labelSize: 12,
    showPropertyPanel: true,
    showSearchBar: true,
    renderLabels: true,
    nodeDraggable: true,
    showEdgeLabel: true,
    hideUnselectedEdges: false,
    edgeEvents: true,
    nodeSize: 1000,
    minEdgeSize: 1,
    maxEdgeSize: 1,
    graphLayoutMaxIterations: 100,
    graphQueryMaxDepth: 3,

    setSetting: (key, value) => set((state) => ({ ...state, [key]: value })),
    setMultiple: (values) => set((state) => ({ ...state, ...values })),
    setShowPropertyPanel: (value) => set({ showPropertyPanel: value }),
    setShowSearchBar: (value) => set({ showSearchBar: value }),
    setRenderLabels: (value) => set({ renderLabels: value }),
    setNodeDraggable: (value) => set({ nodeDraggable: value }),
    setShowEdgeLabel: (value) => set({ showEdgeLabel: value }),
    setHideUnselectedEdges: (value) => set({ hideUnselectedEdges: value }),
    setEdgeEvents: (value) => set({ edgeEvents: value }),
    setNodeSize: (size) => set({ nodeSize: size }),
    setMinEdgeSize: (val) => set({ minEdgeSize: val }),
    setMaxEdgeSize: (val) => set({ maxEdgeSize: val }),
    setGraphLayoutMaxIterations: (iterations) => set({ graphLayoutMaxIterations: iterations }),
    setGraphQueryMaxDepth: (depth) => set({ graphQueryMaxDepth: depth }),
}));
