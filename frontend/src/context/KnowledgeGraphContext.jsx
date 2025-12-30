// context/knowledgeGraphContext.jsx
import React, { createContext, useContext } from "react";

export const KnowledgeGraphContext = createContext(null);

export const useKnowledgeGraph = () => {
  const context = useContext(KnowledgeGraphContext);
  if (!context) {
    throw new Error(
      "useKnowledgeGraph must be used within a KnowledgeGraphProvider",
    );
  }
  return context;
};

export const KnowledgeGraphProvider = ({ value, children }) => (
  <KnowledgeGraphContext.Provider value={value}>
    {children}
  </KnowledgeGraphContext.Provider>
);
