"use client";

import { getChannelData, getUserChats } from "../_actions/chat";
import { createChannelAction, leaveChannelAction } from "../_actions/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IChatStore, useChatStore } from "@/store/chat";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { getDmOther } from "./chat-header";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateChannelDialog } from "./chat-create-channel-dialog";
import { JoinChannelDialog } from "./chat-join-channel-dialog";

export function ListChannel(props: { data: any; userId: string }) {
  const { data, userId } = props;
  const [openCreateChannel, setOpenCreateChannel] = useState(false);
  const [openJoinChannel, setOpenJoinChannel] = useState(false);
  const [
    chatId,
    chatList,
    chatUserList,
    chatMeta,
    chatIsLoading,
    setChatId,
    setChatList,
    setChatUserList,
    setChatMeta,
    setChatIsLoading,
  ] = useChatStore((state: IChatStore) => [
    state.chatId,
    state.chatList,
    state.chatUserList,
    state.chatMeta,
    state.chatIsLoading,
    state.setChatId,
    state.setChatList,
    state.setChatUserList,
    state.setChatMeta,
    state.setChatIsLoading,
  ]);

  const handleViewChannel = (channel: any) => {
    if (chatIsLoading) return;
    setChatId(channel.chatId);
  };

  const handleLeaveChannel = async (id: string) => {
    if (chatIsLoading) return;
    const res = await leaveChannelAction(id, userId);
    if (res.data) {
      toast.success("Channel left successfully");
      getUserChats(userId).then((data) => {
        setChatList(data.data);
      });
    } else {
      toast.error(res.error);
    }
  };

  function createAbbreviation(sentence: string) {
    // Split the sentence into words
    const words = sentence.trim().split(" ");
    if (!words[0]) return "";

    // Initialize an empty string to store the abbreviation
    let abbreviation = "";

    // Loop through each word and append the first letter (up to 4 characters) to the abbreviation
    for (let i = 0; i < words.length; i++) {
      const firstLetter = words[i][0]; // Get the first letter of the word
      abbreviation += firstLetter; // Append the first letter
    }

    return abbreviation.slice(0, 4);
  }

  return (
    <div className="flex flex-col justify-between h-full p-2 pt-12 space-y-2">
      <ScrollArea className="h-[750px] pr-3" scrollHideDelay={10}>
        <Accordion
          type="multiple"
          className="container flex flex-col px-0 space-y-2"
        >
          <AccordionItem value="public">
            <AccordionTrigger>
              <Badge>Public</Badge>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col px-0 space-y-2">
              {data?.map((channel: any, index: number) => {
                if (channel.chatType !== "public") return null;
                return (
                  <ContextMenu key={index}>
                    <ContextMenuTrigger disabled={chatIsLoading}>
                      <Tooltip delayDuration={10}>
                        <TooltipTrigger disabled={chatIsLoading}>
                          <Avatar onClick={() => handleViewChannel(channel)}>
                            <AvatarFallback>
                              {createAbbreviation(channel.chatName)}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {channel.chatName}
                        </TooltipContent>
                      </Tooltip>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        onClick={() => {
                          handleLeaveChannel(channel.chatId);
                        }}
                      >
                        leave channel
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                );
              })}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="protected">
            <AccordionTrigger>
              <Badge>Private</Badge>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col px-0 space-y-2">
              {data?.map((channel: any, index: number) => {
                if (channel.chatType !== "private") return null;
                return (
                  <ContextMenu key={index}>
                    <ContextMenuTrigger>
                      <Tooltip delayDuration={10}>
                        <TooltipTrigger>
                          <Avatar onClick={() => handleViewChannel(channel)}>
                            <AvatarFallback>
                              {createAbbreviation(channel.chatName)}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {channel.chatName}
                        </TooltipContent>
                      </Tooltip>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        onClick={() => {
                          handleLeaveChannel(channel.chatId);
                        }}
                      >
                        leave channel
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                );
              })}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="dm">
            <AccordionTrigger>
              <Badge>Direct</Badge>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col px-0 space-y-2">
              {data?.map((channel: any, index: number) => {
                if (channel.chatType !== "direct") return null;
                return (
                  <Tooltip key={index} delayDuration={10}>
                    <TooltipTrigger asChild>
                      <Avatar
                        onClick={() => handleViewChannel(channel)}
                        className="cursor-pointer"
                      >
                        <AvatarImage
                          src={getDmOther(channel.chatUsers, userId).imageUrl}
                        />
                        <AvatarFallback>
                          {createAbbreviation(
                            getDmOther(channel.chatUsers, userId)
                              ?.displayName ?? "DM"
                          )}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {getDmOther(channel.chatUsers, userId)?.displayName ??
                        "DM"}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
      <DropdownMenu>
        <Tooltip delayDuration={10}>
          <DropdownMenuTrigger asChild>
            <TooltipTrigger asChild>
              <Button className="rounded-full ">
                <Plus size={"24"} />
              </Button>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <TooltipContent>Join/Create Channel</TooltipContent>
        </Tooltip>
        <DropdownMenuContent side="left">
          <DropdownMenuItem
            onClick={() => {
              setOpenJoinChannel((prev) => !prev);
            }}
          >
            join channnel
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setOpenCreateChannel((prev) => !prev);
            }}
          >
            create channel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <JoinChannelDialog
        userId={userId}
        setChatId={setChatId}
        open={openJoinChannel}
        setOpen={setOpenJoinChannel}
      />
      <CreateChannelDialog
        userId={userId}
        setChatId={setChatId}
        open={openCreateChannel}
        setOpen={setOpenCreateChannel}
      />
    </div>
  );
}
