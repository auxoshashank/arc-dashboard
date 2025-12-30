import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

export default function UserAvatar({ avatarSrc = "", userName = "" }) {
  const { data: session } = useSession();
  const user = session?.user;
  const initials = (userName || user?.name)
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const avatarImageSrc = avatarSrc || user?.image;

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={avatarSrc || user?.image || null} alt="User" />
      <AvatarFallback className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-sm font-bold text-white">
        {initials ?? "U"}
      </AvatarFallback>
    </Avatar>
  );
}
