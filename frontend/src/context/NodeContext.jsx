"use client";

import React, { createContext, useContext, useState } from "react";

const NodeContext = createContext(undefined);

export const NodeProvider = ({ children }) => {
    const [selectedNode, setSelectedNode] = useState(null);

    return (
        <NodeContext.Provider value={{ selectedNode, setSelectedNode }}>
            {children}
        </NodeContext.Provider>
    );
};

export const useNodeContext = () => {
    const context = useContext(NodeContext);
    if (!context) {
        throw new Error("useNodeContext must be used within a NodeProvider");
    }
    return context;
};
