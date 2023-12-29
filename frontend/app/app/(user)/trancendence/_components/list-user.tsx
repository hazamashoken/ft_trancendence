"use client";

import { CheckboxForm } from "@/components/form/checkbox";
import { InputForm } from "@/components/form/input";
import { SelectForm } from "@/components/form/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Loader2, ServerCrash } from "lucide-react";
import {
  createChannelAction,
  addChannelUserAction,
  kickChatUser,
  createDMChannelAction,
  muteChatUser,
  unMuteChatUser,
  banChatUser,
  addChatAdmin,
  removeChatAdmin,
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
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
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
import { useSession } from "next-auth/react";
import { createAbbreviation } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  username: z.string().min(1, "username is required"),
});

export function ListUser(props: { data: any; userId: string }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
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
  const { data } = props;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const handleAddUser = async (value: any) => {
    const res = await addChannelUserAction(chatId, value.username);
    if (res.data) {
      toast.success("Add user success");
      setOpen(false);
      setChatUserList(res.data);
      form.reset();
    } else {
      toast.error(res.error);
    }
  };

  const handleMuteUser = async (min: number, userId: string) => {
    const payload = {
      chatId: chatId,
      userId: userId,
      mutedById: "4",
      mutedUntil: new Date(Date.now() + min * 60000).toISOString(),
    };
    const res = await muteChatUser(payload);
    if (res.data) {
      toast.success("Mute user success");
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="flex flex-col justify-center h-full p-2 pt-12 space-y-2">
      <Badge>User</Badge>
      <ScrollArea className="h-[750px] pl-3" scrollHideDelay={10}>
        <div className="container flex flex-col px-0 space-y-2">
          {!chatIsLoading ? (
            data.map((user: any, index: number) => {
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
                      <ContextMenuContent
                        hidden={props.userId === user.id.toString()}
                      >
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
                          create DM
                        </ContextMenuItem>
                        <ContextMenuItem disabled>
                          invite to game
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem disabled>add friend</ContextMenuItem>
                        <ContextMenuItem disabled>
                          remove friend
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem
                          onClick={async () => {
                            const res = await blockUser({
                              blockId: user.id,
                              userId: props.userId,
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
                              blockId: user.id,
                              userId: props.userId,
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
                        <ContextMenuItem
                          onClick={async () => {
                            const res = await unMuteChatUser({
                              userId: user.id,
                              chatId: chatId,
                            });
                            if (res.data) {
                              toast.success("Unmuted user success");
                            } else {
                              toast.error(res.error);
                            }
                          }}
                        >
                          unmute
                        </ContextMenuItem>
                        <ContextMenuSub>
                          <ContextMenuSubTrigger>mute</ContextMenuSubTrigger>
                          <ContextMenuSubContent>
                            <ContextMenuItem
                              onClick={() => {
                                handleMuteUser(30, user.id);
                              }}
                            >
                              30 min
                            </ContextMenuItem>
                            <ContextMenuItem
                              onClick={() => {
                                handleMuteUser(60, user.id);
                              }}
                            >
                              1 h
                            </ContextMenuItem>
                            <ContextMenuItem
                              onClick={() => {
                                handleMuteUser(120, user.id);
                              }}
                            >
                              2 h
                            </ContextMenuItem>
                            <ContextMenuItem
                              onClick={() => {
                                handleMuteUser(240, user.id);
                              }}
                            >
                              4 h
                            </ContextMenuItem>
                          </ContextMenuSubContent>
                        </ContextMenuSub>
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
                        <ContextMenuItem
                          onClick={async () => {
                            const res = await banChatUser({
                              chatId: chatId,
                              userId: user.id,
                              adminId: "4",
                            });
                            if (res.data) {
                              toast.success("Ban user success");
                            } else {
                              toast.error(res.error);
                            }
                          }}
                        >
                          ban
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem
                          onClick={async () => {
                            const res = await addChatAdmin(chatId, user.id);
                            if (res.data) {
                              toast.success("Add admin success");
                            } else {
                              toast.error(res.error);
                            }
                          }}
                        >
                          make admin
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={async () => {
                            const res = await removeChatAdmin(chatId, user.id);
                            if (res.data) {
                              toast.success("Remove admin success");
                            } else {
                              toast.error(res.error);
                            }
                          }}
                        >
                          remove admin
                        </ContextMenuItem>
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
            })
          ) : (
            <div className="container flex flex-col px-0 space-y-2">
              <Skeleton className="relative flex w-10 h-10 overflow-hidden rounded-full shrink-0" />
              <Skeleton className="relative flex w-10 h-10 overflow-hidden rounded-full shrink-0" />
              <Skeleton className="relative flex w-10 h-10 overflow-hidden rounded-full shrink-0" />
            </div>
          )}
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
          {chatMeta.chatType !== "direct" && (
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button className="w-10 h-10 rounded-full">+</Button>
              </DialogTrigger>
            </TooltipTrigger>
          )}
          <TooltipContent>Add User</TooltipContent>
        </Tooltip>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddUser)}>
              <div>
                <InputForm
                  label="Username"
                  name="username"
                  form={form}
                  isRequired
                  msg
                />
                <DialogFooter>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                      <Loader2 className="w-4 h-4 my-4 text-zinc-500 animate-spin" />
                    ) : (
                      "invite"
                    )}
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
