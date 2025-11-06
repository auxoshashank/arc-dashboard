"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import PageTitle from "@/components/PageTitle";
import { saveSolutionTitle } from "@/actions/save-solution-title";
import { Input } from "@/components/ui/input";
import { useSearchContext } from "@/context/SearchContext"; 
import { usePathname } from "next/navigation";

const Topbar = ({
  breadcrumbs,
  editableBreadcrumb,
  onEditTitle,
  projectId,
  actions,
  enableSearch = false,
  searchPlaceholder = "Search...",
}) => {
  const router = useRouter();
  const { searchText, setSearchText } = useSearchContext();
  const pathname = usePathname();

  useEffect(() => {
    return () => {
      setSearchText("");
    };
  }, [setSearchText]);

  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-gray-300 px-6 py-4",
      )}
    >
      {/* Left section: Breadcrumbs and optional editable last breadcrumb */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <nav className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((breadcrumb, index) => {
              if (index === breadcrumbs.length - 1 && editableBreadcrumb) {
                return null;
              }
              return (
                <span key={index} className="flex items-center">
                  <Link
                    href={breadcrumb.href || "#"}
                    className={cn(
                      index === breadcrumbs.length - 1
                        ? "font-bold text-black"
                        : "text-gray-500 hover:underline",
                    )}
                  >
                    {breadcrumb.label}
                  </Link>
                  {index < breadcrumbs.length - 1 && (
                    <span className="mx-2 text-gray-400">›</span>
                  )}
                </span>
              );
            })}
            {/* Render editable breadcrumb as the last breadcrumb */}
            {editableBreadcrumb && (
              <>
                <span key={editableBreadcrumb.id} className="flex items-center">
                  <PageTitle
                    title={editableBreadcrumb.label}
                    description={editableBreadcrumb.description}
                    icon={editableBreadcrumb.icon}
                    id={editableBreadcrumb.id}
                    projectId={projectId}
                    showEditTitle={true}
                    onEditTitle={saveSolutionTitle}
                  />
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Right section: Create button and custom actions */}
      <div className="flex items-center gap-4">
      {enableSearch && !pathname.includes("playground") &&  (
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        )}
        {actions}
      </div>
    </div>
  );
};

export default Topbar;
