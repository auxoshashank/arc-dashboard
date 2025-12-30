"use client";

import EllipsisTooltip from "./EllipsisTooltip";
import { Icons } from "@/components/Icons";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ServerCard({
  id,
  title,
  url,
  description,
  icon,
}) {
     const pageParams = useParams();
     const projectId = pageParams?.projectId;
  return (
    <Link href={`/studio/projects/${projectId}/mcp-server/${id}`}>
      <div className="max-w-sm cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
        {/* Top row: Icon + Title */}
        <div className="mb-1 flex items-center gap-2">
          <div className="mb-2 flex h-5 w-5 items-center justify-center text-violet-600">
            {icon ?? <Icons.mcpCardIcon />}
          </div>
          <h3 className="font-inter mb-2 text-[14px] leading-[130%] font-medium text-[#19213D]">
            {title}
          </h3>
        </div>

        <EllipsisTooltip
          lines={1}
          text={url}
          className="whitespace-nowrap font-inter self-stretch mb-2 text-[12px] cursor-pointer leading-[150%] text-ellipsis overflow-hidden font-normal text-[#666F8D]"
        />

        {/* Description with clamp */}
        <EllipsisTooltip
          lines={1}
          text={description}
          className="whitespace-nowrap font-inter mb-2 self-stretch overflow-hidden cursor-pointer text-[14px] leading-[150%] font-normal text-ellipsis text-[#666F8D]"
        />

        {/* Remote label */}
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#EDF2FE] px-3 py-0.5">
            <Icons.mcpGlobeIcon />
            <p className="font-inter font-normal text-[10px] leading-[24px] text-black/95">Remote</p>
          </div>
      </div>
    </Link>
  );
}
