"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import noImage from "@/assets/Image BG 1-4.png";
import Link from "next/link";
import EllipsisTooltip from "./EllipsisTooltip";

export default function ProjectCard({
  id,
  title,
  description,
  image,
  iconOptions,
}) {
  const isValidImage =
    image &&
    (image.startsWith("http") ||
      image.startsWith("/") ||
      image.startsWith("data:image/"));

  // Check if image is an icon ID
  const selectedIconObj = iconOptions.find((opt) => opt.id === image);

  return (
    <Link
      href={`/studio/projects/${id}/roles`}
      className="flex cursor-pointer flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md">
        {isValidImage ? (
          <Image
            src={image}
            alt={title}
            width={50}
            height={50}
            className="flex-shrink-0 rounded-t-md object-cover"
          />
        ) : selectedIconObj ? (
          <div className="flex h-full w-full items-center justify-center rounded-md">
            {selectedIconObj.icon}
          </div>
        ) : (
          <Image
            src={noImage}
            alt="No Image"
            width={50}
            height={50}
            className="flex-shrink-0 rounded-t-md object-cover"
          />
        )}
      </div>
      <h3 className="text-base font-semibold break-words text-gray-900">
        {title}
      </h3>
      {/* <p className="mt-2 text-sm leading-snug break-words text-gray-600">
        {description}
      </p> */}
      <EllipsisTooltip
        lines={2}
        text={description}
        className="mt-2 text-sm leading-snug break-words text-gray-600"
      />
    </Link>
  );
}
