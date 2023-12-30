"use client";

// Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NotificationItem } from "./friendship-item";

// Icons
import { Contact, Loader2Icon } from "lucide-react";
import { FriendshipAddUserDialog } from "./friendship-add-dialong";
import { useStatusSocket } from "../providers/status-socket.provider";
import React from "react";

export function FriendshipBtn(props: any) {
  const { items, loading } = props;
  const [onlineUsers, setOnlineUsers] = React.useState({});
  const [ingameUsers, setIngameUsers] = React.useState({});

  const { isConnected, socket } = useStatusSocket();

  React.useEffect(() => {
    if (!socket) return;
    socket?.on("listOnlineUsers", (data: any) => {
      setOnlineUsers(data);
    });
    socket?.on("listIngameUsers", (data: any) => {
      setIngameUsers(data);
    });
  }, [socket]);

  const gotRequest = items?.filter((item: any) => item.status === "WAITING");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          id="layout-notify-btn"
          variant={gotRequest?.length > 0 ? "default" : "outline"}
          size="icon"
        >
          <Contact className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[25.25rem] p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-zinc-200/90">
            <div className="flex flex-row items-center gap-x-2">
              <CardTitle className="text-xl font-semibold -tracking-[0.009rem]">
                Friendship
              </CardTitle>
            </div>
            <FriendshipAddUserDialog />
          </CardHeader>
          <CardContent className="relative flex flex-col p-0">
            <ul className="p-0 list-none max-h-[34rem] overflow-x-hidden overflow-y-auto">
              {!items || items?.length > 0 ? (
                items?.map((item: any) => {
                  return (
                    <NotificationItem
                      key={item.id}
                      isInGame={
                        // @ts-ignore
                        ingameUsers?.users?.filter(
                          (user: any) => user.id === item.friend.id
                        ).length > 0
                      }
                      isOnline={
                        // @ts-ignore
                        onlineUsers?.users!?.filter(
                          (user: any) => user.id === item.friend.id
                        ).length > 0
                      }
                      {...item}
                    />
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-[34rem] gap-4">
                  <Contact size={120} strokeWidth={0.5} color="#71717a" />
                  <p className="font-medium text-zinc-500">
                    YOU GOT NO FRIENDSHIP
                  </p>
                </div>
              )}
            </ul>
            {loading && (
              <div className="absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full bg-white/20 backdrop-blur-sm">
                <Loader2Icon className="animate-spin text-primary" size={40} />
              </div>
            )}
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
