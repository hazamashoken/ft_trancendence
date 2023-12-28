"use client";

import { InputForm } from "@/components/form/input";
import { SelectForm } from "@/components/form/select";
import { Button } from "@/components/ui/button";
import { getChannelData, getUserChats } from "../_actions/chat";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { createChannelAction, leaveChannelAction } from "../_actions/chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { getDmOther } from "./chat-header";

const formSchema = z.object({
  chatName: z.string().min(1),
  chatOwner: z.coerce.number(),
  password: z.string().nullable(),
  chatType: z.string(),
});

export function ListChannel(props: { data: any; userId: string }) {
  const { data, userId } = props;
  const [open, setOpen] = useState(false);
  const [
    chatId,
    chatList,
    chatUserList,
    chatMeta,
    setChatId,
    setChatList,
    setChatUserList,
    setChatMeta,
  ] = useChatStore((state: IChatStore) => [
    state.chatId,
    state.chatList,
    state.chatUserList,
    state.chatMeta,
    state.setChatId,
    state.setChatList,
    state.setChatUserList,
    state.setChatMeta,
  ]);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chatName: null,
      chatOwner: userId,
      password: null,
      chatType: "public" as "public" | "private",
    },
  });

  const handleSubmit = async (values: any) => {
    const payload = {
      chatOwner: parseInt(values.chatOwner),
      chatName: values.chatName?.trim(),
      chatType: values.chatType,
      password: values.chatType == "private" ? values.password?.trim() : null,
    };
    const res = await createChannelAction(payload);
    if (res.data) {
      toast.success("Channel created successfully");
      setChatId(res.data.chatId);
      form.reset();
      setOpen(false);
    } else {
      toast.error(res.error);
    }
  };

  const handleViewChannel = (channel: any) => {
    setChatId(channel.chatId);
  };

  const handleLeaveChannel = async (id: string) => {
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
                      {/* <ContextMenuItem onClick={() => {}}>
                      channel settings
                    </ContextMenuItem> */}
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
                    <TooltipTrigger>
                      <Avatar onClick={() => handleViewChannel(channel)}>
                        <AvatarFallback>
                          {createAbbreviation(
                            getDmOther(channel.chatUsers, userId)
                              ?.displayName ?? "DM"
                          )}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {channel.chatName}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          form.reset();
        }}
      >
        <Tooltip delayDuration={10}>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button className="w-10 h-10 rounded-full">+</Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Create Channel</TooltipContent>
        </Tooltip>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <InputForm
                label="Chat Name"
                name="chatName"
                form={form}
                isRequired
              />
              <SelectForm
                label="Chat Type"
                name="chatType"
                form={form}
                isRequired
                options={[
                  { label: "Public", value: "public" },
                  { label: "Private", value: "private" },
                ]}
              />
              {form.watch("chatType") === "private" && (
                <InputForm label="Password" name="password" form={form} />
              )}
              <Button>Create</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
