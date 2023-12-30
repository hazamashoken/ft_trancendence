"use client";
import { Hash, Loader2 } from "lucide-react";

// import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { SocketIndicator } from "@/components/socket-indicator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ChatSettingMenu } from "./chat-setting-dialog";
import { Skeleton } from "@/components/ui/skeleton";

// import { ChatVideoButton } from "./chat-video-button";

interface ChatHeaderProps {
  type: "private" | "direct" | "protected" | "public";
  imageUrl?: string;
  chatId: string;
  chatMeta: any;
  chatUserList?: any;
  userId: string;
  chatIsLoading: boolean;
}

export function getDmOther(chatUserList: any, userId: string) {
  const other = chatUserList?.filter(
    (user: any) => user.id.toString() !== userId
  );
  if (!other) return null;
  return other[0];
}

export const ChatHeader = ({
  type,
  imageUrl,
  chatId,
  chatMeta,
  chatUserList,
  userId,
  chatIsLoading,
}: ChatHeaderProps) => {
  if (chatIsLoading) {
    return (
      <div className="flex items-center h-12 px-3 font-semibold border-b-2 text-md border-neutral-200 dark:border-neutral-800">
        <Hash className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-black truncate w-28 text-md dark:text-white">
          <Loader2 className="w-5 h-5 my-4 text-zinc-500 animate-spin" />
        </p>
        <Skeleton className="flex items-center ml-auto">
          <SocketIndicator />
        </Skeleton>
      </div>
    );
  }

  const user = getDmOther(chatUserList, userId);
  return (
    <div className="flex items-center h-12 px-3 font-semibold border-b-2 text-md border-neutral-200 dark:border-neutral-800">
      <Hash className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />
      <p className="font-semibold text-black truncate w-28 text-md dark:text-white">
        {chatMeta?.chatType != "direct" ? chatMeta.name : user?.displayName}
      </p>
      <div className="flex items-center gap-3 px-4 ml-auto">
        {chatId && chatMeta?.chatType != "direct" && <ChatSettingMenu />}
        <SocketIndicator />
      </div>
    </div>
  );
};
