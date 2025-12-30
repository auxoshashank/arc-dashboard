"use client";

import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Icons } from "./Icons";

export default function SideDrawer({
  children,
  isOpen,
  onClose,
  className,
  showOverlay = true,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <>
      {showOverlay && (
        <div
          className={cn(
            "fixed inset-0 z-10 flex transition-opacity duration-300",
            isOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0",
          )}
        >
            <div
              className="fixed inset-0 bg-black opacity-50 transition-opacity duration-300"
              onClick={onClose}
            ></div>
        </div>
      )}
      <aside
        className={cn(
          "fixed top-0 right-0 z-20 flex h-screen w-[400px] transform overflow-y-auto border-l bg-white p-4 transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
          className,
        )}
      >
        <Icons.cross
          className="absolute top-4 right-4 cursor-pointer"
          onClick={onClose}
        />
        {children}
      </aside>
    </>
  );
}
