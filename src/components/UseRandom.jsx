"use client";

import { DirectedGraph } from "graphology";
import { useEffect, useState, useRef, useMemo } from "react";
import { handleError } from "@/lib/utils";
import { api } from "@/lib/api";
import { API_ENDPOINTS, getApiEndpoint } from "@/config/apiEndpoints";
import { useSolutionContext } from "../../src/app/studio/projects/[projectId]/solutions/[solutionId]/context/SolutionContext";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

const fallbackColors = [
  "#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231", "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe",
  "#008080", "#e6beff", "#9a6324", "#fffac8", "#800000", "#aaffc3", "#808000", "#ffd8b1", "#000075", "#808080",
  "#ffffff", "#000000", "#ff7f00", "#00ff00", "#007f7f", "#ff0000", "#0000ff", "#7f00ff", "#7fff00", "#00ffff",
  "#8b0000", "#b8860b", "#006400", "#8b008b", "#483d8b", "#2e8b57", "#4682b4", "#d2691e", "#ff1493", "#1e90ff",
  "#228b22", "#daa520", "#4b0082", "#dc143c", "#00ced1", "#ff4500", "#9932cc", "#00fa9a", "#ff69b4", "#6495ed",
];

export const useStaticGraph = (dataOpsId = null) => {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(false);
  const [graph, setGraph] = useState(null);

  const { data: session } = useSession();
  const token = session?.accessToken || "";
  const params = useParams();
  const projectId = params?.projectId || "";

  const entityColorMapRef = useRef(new Map());
  const colorIndexRef = useRef(0);

  const getNodeColor = (entityType) => {
    const type = entityType?.trim() || "Unknown";
    const map = entityColorMapRef.current;

    if (!map.has(type)) {
      const color =
        type === "Unknown"
          ? fallbackColors[49]
          : fallbackColors[colorIndexRef.current++ % fallbackColors.length];
      map.set(type, color);
    }

    return map.get(type);
  };

  useEffect(() => {
    const fetchKnowledgeGraph = async () => {
      if (!dataOpsId || !token) return;

      try {
        setLoading(true);
        const knowledgeGraphData = await api.get(
          getApiEndpoint(API_ENDPOINTS.knowledgeGraph, {
            knowledgeId: dataOpsId,
          }),
          {
            "x-project-id": projectId,
            Authorization: `Bearer ${token}`,
          }
        );

        if (knowledgeGraphData?.graph) {
          setGraphData({
            nodes: knowledgeGraphData.graph.nodes || [],
            edges: knowledgeGraphData.graph.edges || [],
          });
        }
      } catch (err) {
        handleError("Failed to fetch Knowledge base. Please try again.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledgeGraph();
  }, [dataOpsId, token]);

  useEffect(() => {
    const g = new DirectedGraph();

    graphData.nodes.forEach((node, index) => {
      const entityType = node?.properties?.entity_type;
      const label =
        node.name ||
        node.labels?.[0]?.substring(node.labels[0].lastIndexOf("-") + 1).trim() ||
        node.label?.[0] ||
        `Node ${index}`;

      g.addNode(node.id, {
        x: Math.random(),
        y: Math.random(),
        label,
        size: 1,
        color: getNodeColor(entityType),
        labelColor: "#9c27b0",
        properties: node.properties ?? {},
      });
    });

    graphData.edges.forEach((link) => {
      if (g.hasNode(link.source) && g.hasNode(link.target)) {
        g.addEdge(link.source, link.target, {
          labelColor: "#9c27b0",
          //   label: link.properties?.keywords ?? {},
          id: link.id,
          data: link.type,
          ...link.properties,
        });
      }
    });

    g.forEachNode((node) => {
      let degree = g.degree(node);
      degree = Math.min(degree, 50);
      const size = Math.min(degree > 0 ? 5 + degree * 2 : 5, 50);
      g.setNodeAttribute(node, "size", size);
    });

    setGraph(g);
  }, [graphData]);

  const legendData = useMemo(() => {
    return Array.from(entityColorMapRef.current.entries())
      .map(([type, color]) => ({ type, color }))
      .sort((a, b) =>
        a.type.localeCompare(b.type, undefined, { sensitivity: "base" })
      );
  }, [graph]);

  return { graph, legendData, loading };
};
