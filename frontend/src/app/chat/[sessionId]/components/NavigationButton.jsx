"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

export default function NavigationButton({ currentPath, routes }) {
  const router = useRouter();
  const pathname = usePathname();

  const replaceLastSegment = (newSegment) => {
    const pathSegments = pathname.split("/").filter(Boolean);

    if (pathSegments.length > 0) {
      if (routes.hasOwnProperty("/" + pathSegments[pathSegments.length - 1])) {
        pathSegments[pathSegments.length - 1] = newSegment;
      } else {
        pathSegments.push(newSegment);
      }
    }

    const newUrl = `/${pathSegments.join("/")}`;
    router.replace(newUrl);
  };

  return currentPath?.title ? (
    <Button
      onClick={() => replaceLastSegment(currentPath?.path)}
      className="cursor-pointer"
    >
      {currentPath?.title || ""}
    </Button>
  ) : null;
}
