import React from "react";
import ReactDOMServer from "react-dom/server";
import { Icons } from "@/components/Icons";

export const iconOptions = [
  {
    id: "sparkles",
    icon: <Icons.projectIcon1 size={50} />,
  },
  {
    id: "message",
    icon: <Icons.projectIcon2 size={50} />,
  },
  {
    id: "puzzle",
    icon: <Icons.projectIcon3 size={50} />,
  },
  {
    id: "clipboard",
    icon: <Icons.projectIcon4 size={50} />,
  },
  {
    id: "plus",
    icon: <Icons.projectIcon5 className="text-primary" size={50} />,
  },
];

const generateBase64Map = () => {
  const map = {};
  for (const { id, icon } of iconOptions) {
    const svgString = ReactDOMServer.renderToStaticMarkup(icon);
    const encoded = Buffer.from(svgString).toString("base64");
    map[id] = `data:image/svg+xml;base64,${encoded}`;
  }
  return map;
};

export const iconBase64Map = generateBase64Map();
