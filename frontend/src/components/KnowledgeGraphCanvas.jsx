"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

const KnowledgeGraphCanvas = ({
  data,
  onNodeClick,
  hoveredLink,
  setHoveredLink,
  hoveredNode,
  setHoveredNode,
  tooltipPosition,
  setTooltipPosition,
  fgRef,
}) => {
  const [renderKey, setRenderKey] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);

  useEffect(() => {
    if (fgRef.current && data?.nodes?.length > 0) {
      // Set initial positions
      data.nodes.forEach((node) => {
        node.x = Math.random() * 1000 - 500;
        node.y = Math.random() * 1000 - 500;
      });

      fgRef.current.d3Force("charge").strength(-800);
      fgRef.current.d3ReheatSimulation();
      setRenderKey((prev) => prev + 1);

      // Wait for canvas to render THEN set zoom to 1
      requestAnimationFrame(() => {
        if (fgRef.current) {
          fgRef.current.zoom(1, 0);
          setZoomLevel(100);
        }
      });
    }
  }, [data]);

  useEffect(() => {
    const canvas = document.getElementById("gridCanvas");
    const ctx = canvas.getContext("2d");

    const drawGrid = () => {
      const size = 40; // Grid square size
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#E8E6EB"; // Light grid color
      ctx.lineWidth = 0.5;

      for (let x = 0; x < canvas.width; x += size) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += size) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    drawGrid();
    window.addEventListener("resize", drawGrid);
    return () => window.removeEventListener("resize", drawGrid);
  }, []);

  useEffect(() => {
    const handleZoom = () => {
      if (!fgRef.current) return;

      const transform = fgRef.current.zoom();
      const level = transform * 100;
      setZoomLevel(Math.round(level));
    };

    const interval = setInterval(handleZoom, 200); // Poll every 200ms

    return () => clearInterval(interval);
  }, []);

  const handleZoom = (delta) => {
    if (fgRef.current) {
      const currentZoom = fgRef.current.zoom(); // current zoom (0.1 to 5, for example)
      const newZoom = Math.min(Math.max(currentZoom + delta / 100, 0.05), 5); // now allows up to 500%
      fgRef.current.zoom(newZoom, 500);
      setZoomLevel(Math.round(newZoom * 100));
    }
  };

  const getConnectedNodeIds = (node, graph) => {
    const connected = new Set();

    graph.links.forEach((link) => {
      if (link.source.id === node.id) {
        connected.add(link.target.id);
      } else if (link.target.id === node.id) {
        connected.add(link.source.id);
      }
    });

    return connected;
  };

  const zoomToFit = () => {
    fgRef.current?.zoomToFit(400);
  };

  return (
    <>
      <ForceGraph2D
        key={renderKey}
        ref={fgRef}
        graphData={data}
        enableNodeDrag={true}
        onNodeClick={onNodeClick}
        nodeRelSize={10}
        nodeCanvasObject={(node, ctx) => drawNode(node, ctx)}
        nodePointerAreaPaint={(node, color, ctx) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 15, 0, 2 * Math.PI);
          ctx.fill();
        }}
        linkDirectionalArrowLength={8}
        linkDirectionalArrowRelPos={1}
        linkCanvasObjectMode={() => "after"}
        linkCanvasObject={(link, ctx) =>
          drawLinkAndArrow(link, ctx, hoveredLink)
        }
        onNodeDrag={(node) => {
          // Freeze unrelated nodes
          const connectedNodeIds = getConnectedNodeIds(node, data);
          data.nodes.forEach((n) => {
            if (n.id !== node.id && !connectedNodeIds.has(n.id)) {
              n.fx = n.x;
              n.fy = n.y;
            }
          });
        }}
        onNodeDragEnd={(node) => {
          // Pin the dragged node permanently to prevent it from bouncing
          node.fx = node.x;
          node.fy = node.y;

          // Leave unrelated nodes pinned as well to keep them static
          // Do NOT unfreeze any nodes here
        }}
        onLinkHover={setHoveredLink}
        onNodeHover={(node) => {
          if (node && fgRef.current) {
            const canvas = document.querySelector("canvas");

            const rect = canvas.getBoundingClientRect();

            // Convert 3D coordinates to 2D screen space
            const { x, y } = fgRef.current.graph2ScreenCoords(
              node.x,
              node.y,
              node.z,
            );

            setHoveredNode(node);
            setTooltipPosition({
              x: x + rect.left - 80,
              y: y + rect.top - 80,
            });
          } else {
            setHoveredNode(null);
          }
        }}
      />
      <div className="fixed right-8 bottom-8 z-10 flex items-center space-x-2 rounded-lg bg-white p-1 shadow-lg">
        <Button onClick={zoomToFit} variant="ghost" className="text-black">
          <Icons.expand />
        </Button>
        <Button
          onClick={() => handleZoom(-10)}
          variant="ghost"
          className="text-black"
        >
          <Icons.decrement />
        </Button>
        <span className="text-black">{zoomLevel}%</span>
        <Button
          onClick={() => handleZoom(10)}
          variant="ghost"
          className="text-black"
        >
          <Icons.increment />
        </Button>
        <Button variant="ghost" className="text-black">
          <Icons.help />
        </Button>
      </div>
    </>
  );
};

// Helper: Draw a styled node
const drawNode = (node, ctx) => {
  const radius = 20;
  ctx.beginPath();
  ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle =
    node.label === "Document"
      ? "rgba(20, 166, 47, 0.95)"
      : node.color || "rgba(233, 144, 109, 0.95)";
  ctx.fill();
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "black";
  ctx.font = "5px Inter";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const labelText =
    node.label.length > 10 ? node.label.slice(0, 10) + "…" : node.label;
  ctx.fillText(`ID: ${node.id}`, node.x, node.y - 8);
  ctx.fillText(labelText, node.x, node.y + 8);
};

// Helper: Draw styled link
const drawLinkAndArrow = (link, ctx, hoveredLink) => {
  const { source, target } = link;
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const angle = Math.atan2(dy, dx);
  const arrowSize = 10;
  const radius = 20;
  const arrowX = target.x - Math.cos(angle) * radius;
  const arrowY = target.y - Math.sin(angle) * radius;

  ctx.beginPath();
  ctx.moveTo(source.x, source.y);
  ctx.lineTo(arrowX, arrowY);
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(arrowX, arrowY);
  ctx.lineTo(
    arrowX - arrowSize * Math.cos(angle - Math.PI / 6),
    arrowY - arrowSize * Math.sin(angle - Math.PI / 6),
  );
  ctx.moveTo(arrowX, arrowY);
  ctx.lineTo(
    arrowX - arrowSize * Math.cos(angle + Math.PI / 6),
    arrowY - arrowSize * Math.sin(angle + Math.PI / 6),
  );
  ctx.stroke();

  if (hoveredLink === link) {
    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;
    ctx.font = "5px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(link.type, midX, midY - 8);
  }
};

export default KnowledgeGraphCanvas;
