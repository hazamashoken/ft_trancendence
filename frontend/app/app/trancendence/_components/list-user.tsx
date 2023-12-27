"use client";

import { CheckboxForm } from "@/components/form/checkbox";
import { InputForm } from "@/components/form/input";
import { SelectForm } from "@/components/form/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  createChannelAction,
  addChannelUserAction,
  kickChatUser,
  createDMChannelAction,
} from "../_actions/chat";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IChatStore, useChatStore } from "@/store/chat";
import { useState } from "react";
import { blockUser, unblockUser } from "../_actions/user";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function ListUser(props: { data: any; userId: string }) {
  const [open, setOpen] = useState(false);
  const [chatId] = useChatStore((state: IChatStore) => [
    state.chatId,
    state.chatList,
    state.chatUserList,
    state.chatMeta,
    state.setChatId,
    state.setChatList,
    state.setChatUserList,
    state.setChatMeta,
  ]);
  const { data } = props;
  const form = useForm({
    defaultValues: {
      username: "",
    },
  });

  const handleAddUser = async (value: any) => {
    const res = await addChannelUserAction(chatId, value.username);
    if (res.data) {
      toast.success("Add user success");
      setOpen(false);
      form.reset();
    } else {
      toast.error(res.error);
    }
  };

  function createAbbreviation(sentence: string) {
    // Split the sentence into words
    const words = sentence.trim().split(" ");

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
      <ScrollArea className="h-[750px] pl-3" scrollHideDelay={10}>
        <div className="container flex flex-col px-0 space-y-2">
          <Badge>User</Badge>
          {data.map((user: any, index: number) => {
            return (
              <div key={index}>
                <Popover>
                  <ContextMenu>
                    <PopoverTrigger asChild>
                      <ContextMenuTrigger>
                        <Tooltip delayDuration={10}>
                          <TooltipTrigger>
                            <Avatar>
                              <AvatarImage src={user.imageUrl} />
                              <AvatarFallback>
                                {createAbbreviation(user.displayName)}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            {user.displayName}
                          </TooltipContent>
                        </Tooltip>
                      </ContextMenuTrigger>
                    </PopoverTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        onClick={async () => {
                          const res = await createDMChannelAction(
                            props.userId,
                            user.id
                          );
                          if (res.data) {
                            toast.success("Create DM success");
                            setOpen(false);
                            form.reset();
                          } else {
                            toast.error(res.error);
                          }
                        }}
                      >
                        send message
                      </ContextMenuItem>
                      <ContextMenuItem disabled>invite to game</ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem disabled>add friend</ContextMenuItem>
                      <ContextMenuItem disabled>remove friend</ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem
                        onClick={async () => {
                          const res = await blockUser({
                            id: user.id,
                            myId: props.userId,
                          });

                          if (res.data) {
                            toast.success("Block user success");
                          } else {
                            toast.error(res.error);
                          }
                        }}
                      >
                        block user
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={async () => {
                          const res = await unblockUser({
                            id: user.id,
                            myId: props.userId,
                          });
                          if (res.data) {
                            toast.success("Unblock user success");
                          } else {
                            toast.error(res.error);
                          }
                        }}
                      >
                        unblock user
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem disabled>mute</ContextMenuItem>
                      <ContextMenuItem
                        onClick={async () => {
                          const res = await kickChatUser(chatId, user.id);
                          if (res.data) {
                            toast.success("Kick user success");
                          } else {
                            toast.error(res.error);
                          }
                        }}
                      >
                        kick
                      </ContextMenuItem>
                      <ContextMenuItem disabled>ban</ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem disabled>make admin</ContextMenuItem>
                      <ContextMenuItem disabled>remove admin</ContextMenuItem>
                    </ContextMenuContent>
                    <PopoverContent className="w-[300px] space-y-10">
                      <div className="flex">
                        <Avatar className="w-[70px] h-[70px]">
                          <AvatarImage
                            src={user.imageUrl}
                            className="w-[70px] h-[70px]"
                          />
                          <AvatarFallback className="w-[70px] h-[70px]">
                            {createAbbreviation(user.displayName)}
                          </AvatarFallback>
                        </Avatar>
                        status: {user.status}
                      </div>
                      <Card className="w-full">
                        <CardContent>
                          <p>{user.displayName}</p>
                          <p># {user.id}</p>
                          <Separator />
                          <div className="flex gap-2">
                            <p>win: {user?.stat?.win ?? "1"}</p>
                            <p>lose: {user?.stat?.lose ?? "1"}</p>
                            <p>
                              ratio:{" "}
                              {user?.stat?.win / user?.stat?.lose ?? "100"}%
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </PopoverContent>
                  </ContextMenu>
                </Popover>
              </div>
            );
          })}
        </div>
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
          <TooltipContent>Add User</TooltipContent>
        </Tooltip>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddUser)}>
              <InputForm
                label="Username"
                name="username"
                form={form}
                isRequired
              />
              <Button>Create</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
