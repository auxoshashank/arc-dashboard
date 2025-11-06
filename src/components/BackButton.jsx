"use client";

import { Icons } from "./Icons";
import { cn, goBack } from "@/lib/utils";

export default function BackButton({ link = "", onClick, className }) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      goBack(link);
    }
  };

  return (
    <button
      className={cn(
        "cursor-pointer rounded-full p-2 hover:bg-gray-100",
        className,
      )}
      onClick={handleClick}
    >
      <Icons.back />
    </button>
  );
}
