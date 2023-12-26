"use client";

import { InputForm } from "@/components/form/input";
import { SelectForm } from "@/components/form/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { createChannelAction } from "../_actions/chat";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/store/chat";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ContextMenuSeparator } from "@radix-ui/react-context-menu";

export function ListChannel(props: { data: any }) {
  const { data } = props;
  const [open, setOpen] = useState(false);
  const [chatId, setChatId] = useChatStore((state) => [
    state.chatId,
    state.setChatId,
  ]);
  const form = useForm({
    defaultValues: {
      chatName: null,
      chatOwner: 4,
      password: null,
      maxUsers: null,
      chatType: "public" as "public" | "private",
    },
  });

  const handleSubmit = async (values: any) => {
    const payload = {
      chatOwner: values.chatOwner,
      chatName: values.chatName?.trim(),
      chatType: values.chatType,
      password: values.chatType == "private" ? values.password?.trim() : null,
    };
    console.log(payload);
    const res = await createChannelAction(payload);
    if (res) {
      setChatId(res.chatId);
      setOpen(false);
    }
    console.log(res);
  };

  function createAbbreviation(sentence: string) {
    // Split the sentence into words
    const words = sentence.trim().split(" ");

    // Initialize an empty string to store the abbreviation
    let abbreviation = "";

    // Loop through each word and append the first letter (up to 4 characters) to the abbreviation
    for (let i = 0; i < words.length; i++) {
      const firstLetter = words[i][0]; // Get the first letter of the word
      abbreviation += firstLetter.slice(0, 4); // Append the first letter, limiting to 4 characters
    }

    return abbreviation;
  }

  return (
    <div className="flex flex-col justify-between h-full p-2 pt-12 space-y-2">
      <ScrollArea className="h-[750px] pr-3" scrollHideDelay={10}>
        <div className="container flex flex-col px-0 space-y-2">
          {data.map((channel: any, index: number) => {
            return (
              <div key={index}>
                <ContextMenu>
                  <ContextMenuTrigger>
                    <Tooltip delayDuration={10}>
                      <TooltipTrigger>
                        <Avatar onClick={() => setChatId(channel.chatId)}>
                          <AvatarFallback>
                            {createAbbreviation(channel.chatName)}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>{channel.chatName}</TooltipContent>
                    </Tooltip>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem>add admin</ContextMenuItem>
                    <ContextMenuItem>remove admin</ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem>remove channel</ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <Dialog open={open} onOpenChange={setOpen}>
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
