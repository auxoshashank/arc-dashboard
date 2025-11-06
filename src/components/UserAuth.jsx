"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import UserAvatar from "./UserAvatar";
import Link from "next/link";

export function UserAuth({ collapsed = false }) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const user = session?.user;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {status === "authenticated" ? (
          <div className="flex cursor-pointer items-center space-x-2">
            <UserAvatar />
            {!collapsed && user?.name && (
              <span className="text-sm font-semibold text-gray-900">
                {user.name}
              </span>
            )}
          </div>
        ) : (
          <Link href="/login">
            <Button className="cursor-pointer">Login</Button>
          </Link>
        )}
      </PopoverTrigger>

      <PopoverContent className="mr-3 w-52">
        <div className="space-y-2 text-center">
          <p className="font-medium break-all">{user?.name ?? "Guest"}</p>
          <p className="text-muted-foreground text-sm break-all">
            {user?.email}
          </p>
          <Button
            variant="outline"
            className="!border-primary text-primary hover:text-primary/80 w-full cursor-pointer border"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
