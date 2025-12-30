"use client";

import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ChatProvider } from "@/app/chat/[sessionId]/context/ChatContext";
import Sidebar from "@/components/Sidebar";
import { Icons } from "@/components/Icons";

export default function AppWrapper({ children, session }) {
  const pathname = usePathname();

  // Define routes where SidebarWrapper should be hidden
  const exemptRoutes = ["/login"];
  const shouldShowSidebar = !exemptRoutes.includes(pathname);

  return (
    <>
      <SessionProvider session={session}>
        <ChatProvider>
          {shouldShowSidebar ? (
            <div className="flex h-screen overflow-hidden">
              <Sidebar
                className="fixed h-screen w-64"
                title="Damia"
                titleImage={Icons.damiaLogo}
              />
              {children}
            </div>
          ) : (
            children
          )}
        </ChatProvider>
      </SessionProvider>
      <Toaster position="top-center" richColors theme="light" />
    </>
  );
}
