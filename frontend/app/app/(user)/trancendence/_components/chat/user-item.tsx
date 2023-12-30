"use client";
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
  createChannelAction,
  addChannelUserAction,
  kickChatUser,
  createDMChannelAction,
  muteChatUser,
  unMuteChatUser,
  banChatUser,
  addChatAdmin,
  removeChatAdmin,
  unbanChatUser,
} from "../../_actions/chat";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createAbbreviation } from "@/lib/utils";
import { toast } from "sonner";
import { blockUser, unblockUser } from "../../_actions/user";
import { inviteToMyGame } from "../../_actions/game";
import { addFriend } from "../../_actions/friend";
import {
  addFriendId,
  removeFriend,
} from "@/components/top-navbar/_actions/friendship";
import { useSession } from "next-auth/react";
import React from "react";
import Link from "next/link";

export function UserItem(props: any) {
  const { data: session } = useSession();
  const { user, chatId, role, authUser, userId } = props;
  const [isSelf, setIsSelf] = React.useState(false);
  const handleMuteUser = async (min: number, userId: string) => {
    const payload = {
      chatId: chatId,
      userId: userId,
      mutedById: user?.id,
      mutedUntil: new Date(Date.now() + min * 60000).toISOString(),
    };
    const res = await muteChatUser(payload);
    if (res.data) {
      toast.success("Mute user success");
    } else {
      toast.error(res.error);
    }
  };

  React.useEffect(() => {
    setIsSelf(session?.user?.id === user.id);
  }, [session]);

  return (
    <>
      <Popover>
        <ContextMenu>
          <PopoverTrigger>
            <ContextMenuTrigger disabled={isSelf}>
              <Tooltip delayDuration={10}>
                <TooltipTrigger>
                  <Link href={`/user/${user.id}`}>
                    <Avatar>
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback>
                        {createAbbreviation(user.displayName)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left">{user.displayName}</TooltipContent>
              </Tooltip>
            </ContextMenuTrigger>
          </PopoverTrigger>
          <ContextMenuContent hidden={props.userId === user.id.toString()}>
            <ContextMenuItem
              disabled={isSelf}
              onClick={async () => {
                const res = await createDMChannelAction(authUser?.id, user.id);
                if (res.data) {
                  toast.success("Create DM success");
                } else {
                  toast.error(res.error);
                }
              }}
            >
              create DM
            </ContextMenuItem>
            <ContextMenuItem
              onClick={async () => {
                const res = await inviteToMyGame(user.id);
                if (res.data) {
                  toast.success("Invite to game success");
                } else {
                  toast.error(res.error);
                }
              }}
            >
              invite to game
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={async () => {
                const res = await addFriendId({ userId: user.id });
                if (res.data) {
                  toast.success("Add friend success");
                } else {
                  toast.error(res.error);
                }
              }}
            >
              add friend
            </ContextMenuItem>
            <ContextMenuItem
              onClick={async () => {
                const res = await removeFriend({ userId: user.id });
                if (res.data) {
                  toast.success("Remove friend success");
                } else {
                  toast.error(res.error);
                }
              }}
            >
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
            <ContextMenuItem
              onClick={async () => {
                const res = await unbanChatUser(user.id, chatId);
                if (res.data) {
                  toast.success("Unban user success");
                } else {
                  toast.error(res.error);
                }
              }}
            >
              unban
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
                  <p>win: {user?.stats?.win ?? "1"}</p>
                  <p>lose: {user?.stats?.lose ?? "1"}</p>
                  <p>ratio: {user?.stats?.winRate}%</p>
                </div>
              </CardContent>
            </Card>
          </PopoverContent>
        </ContextMenu>
      </Popover>
    </>
  );
}
