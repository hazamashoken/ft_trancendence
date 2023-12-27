"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Tooltip delayDuration={10}>
        <TooltipTrigger className="w-5 h-5 text-white bg-yellow-600 border-none rounded-full" />
      </Tooltip>
    );
  }

  return (
    <Tooltip delayDuration={10}>
      <TooltipTrigger className="w-5 h-5 text-white border-none rounded-full cursor-default bg-emerald-600" />
      <TooltipContent>Connected</TooltipContent>
    </Tooltip>
  );
};
