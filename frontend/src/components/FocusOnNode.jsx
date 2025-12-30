'use client';

import { useCamera, useSigma } from "@react-sigma/core";
import { useEffect } from "react";

const FocusOnNode = ({ node, move }) => {
  const sigma = useSigma();
  const { gotoNode } = useCamera();

  useEffect(() => {
    if (!node) return;

    sigma.getGraph().setNodeAttribute(node, "highlighted", true);
    if (move) gotoNode(node);

    return () => {
      sigma.getGraph().setNodeAttribute(node, "highlighted", false);
    };
  }, [node, move, sigma, gotoNode]);

  return null;
};

export default FocusOnNode;
