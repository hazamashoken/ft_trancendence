"use client";
import { Hash } from "lucide-react";

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

// import { ChatVideoButton } from "./chat-video-button";

interface ChatHeaderProps {
  type: "channel" | "conversation";
  imageUrl?: string;
  chatId: string;
  chatMeta: any;
}

export const ChatHeader = ({
  type,
  imageUrl,
  chatId,
  chatMeta,
}: ChatHeaderProps) => {
  return (
    <div className="flex items-center h-12 px-3 font-semibold border-b-2 text-md border-neutral-200 dark:border-neutral-800">
      {chatMeta?.chatType && (
        <Badge className="text-xs">{chatMeta?.chatType}</Badge>
      )}
      {type === "channel" && (
        <Hash className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />
      )}
      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="w-8 h-8 mr-2 md:h-8 md:w-8" />
      )}
      <p className="font-semibold text-black truncate w-28 text-md dark:text-white">
        {chatMeta.name}
      </p>
      <div className="flex items-center px-4 ml-auto">
        <SocketIndicator />
      </div>
      {chatId && <ChatSettingMenu />}
    </div>
  );
};
