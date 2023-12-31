"use client";

import { ListChannel } from "./list-channel";
import { MessageArea } from "./message-area";
import { ListUser } from "./list-user";

import { useChatStore, IChatStore } from "@/store/chat";
import { useEffect, useState } from "react";
import {
  getBanlist,
  getChatUser,
  getPublicChat,
  getUserChats,
} from "../../_actions/chat";
import { Card, CardContent } from "@/components/ui/card";
import { useSocket } from "@/components/providers/socket-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function ChatBox(props: { userId: string }) {
  const { userId } = props;
  const { data: session } = useSession();
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
  const [bannedUsers, setBannedUsers] = useState<any>([]);

  const queryClient = useQueryClient();
  const { socket } = useSocket();
  useEffect(() => {
    const getChat = async () => {
      getUserChats(userId).then((res) => {
        setChatList(res.data);
      });
      if (!chatId) return;
      getChatUser(chatId).then((res) => {
        setChatUserList(res.data);
      });
      getBanlist(chatId).then((res) => {
        setBannedUsers(res.data);
      });
    };

    socket?.on("event", (res: any) => {
      if (res.event === "quitChat") {
        getChat();
        if (res.chatId === chatId?.toString()) {
          setChatId("");
          setChatMeta({
            id: "",
            name: "",
            type: "text",
          });
          setChatUserList([]);
        }
      } else if (res.event === "getChatMessages") {
        if (res.chatId === chatId?.toString()) {
          queryClient.invalidateQueries({ queryKey: [`chat:${chatId}`] });
        }
      } else if (res.event === "chat updated") {
        getUserChats(userId).then((res) => {
          setChatList(res.data);
        });
      } else if (res.event === "dmCreated") {
        if (res.chatId === chatId) {
          getUserChats(userId).then((res) => {
            setChatList(res.data);
          });
        }
      } else if (res.event === "addUsersToChat") {
        if (res.chatId === chatId?.toString()) {
          getChatUser(chatId).then((res) => {
            setChatUserList(res.data);
          });
        } else if (res.userName === session?.user?.displayName) {
          getUserChats(userId).then((res) => {
            setChatList(res.data);
          });
        }
      } else if (res.event === "getChatUsers") {
        // console.log(res);
        if (!chatId) return;
        if (res.chatId === chatId?.toString()) {
          getChatUser(chatId).then((res) => {
            setChatUserList(res.data);
          });
          getBanlist(chatId).then((res) => {
            setBannedUsers(res.data);
          });
        } else if (res.userId === userId && res.message === "user removed") {
          getUserChats(userId).then((res) => {
            setChatList(res.data);
          });
          setChatId("");
          setChatMeta({
            id: "",
            name: "",
            type: "text",
          });
          setChatUserList([]);
        }
      }
    });

    getChat();
    return () => {
      socket?.off("event");
    };
  }, [
    chatId,
    socket,
    queryClient,
    userId,
    setChatId,
    setChatList,
    setChatUserList,
    setChatMeta,
  ]);

  return (
    <Card className="m-1">
      <CardContent className="flex h-[800px] p-1 space-x-1">
        <ListChannel data={chatList} userId={userId} />
        <MessageArea userId={userId} />
        {chatId && chatMeta.chatType && chatMeta.chatType !== "direct" && (
          <ListUser
            data={chatUserList}
            userId={userId}
            bannedUsers={bannedUsers}
          />
        )}
      </CardContent>
    </Card>
  );
}
