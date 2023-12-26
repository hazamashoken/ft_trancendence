"use client";

import { ListChannel } from "./list-channel";
import { MessageArea } from "./message-area";
import { ListUser } from "./list-user";

import { useChatStore, IChatStore } from "@/store/chat";
import { useEffect } from "react";
import { getChatUser, getPublicChat, getUserChats } from "../_actions/chat";
import { Card, CardContent } from "@/components/ui/card";
import { useSocket } from "@/components/providers/socket-provider";
import { useQueryClient } from "@tanstack/react-query";

export function ChatBox(props: any) {
  const { userId = "4" } = props;
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

  const queryClient = useQueryClient();
  const { socket } = useSocket();
  useEffect(() => {
    const getChat = async () => {
      getUserChats(userId).then((data) => {
        setChatList(data);
      });
      if (!chatId) return;
      getChatUser(chatId).then((data) => {
        setChatUserList(data);
      });
    };

    socket?.on("event", (res: any) => {
      if (res.event === "quitChat") {
        getChat();
        if (res.chatId === chatId.toString()) {
          setChatId("");
          setChatMeta({
            id: "",
            name: "",
            type: "text",
          });
          setChatUserList([]);
        }
      } else if (res.event === "getChatMessages") {
        queryClient.invalidateQueries({ queryKey: [`chat:${res.chatId}`] });
      } else if (res.event === "chat updated") {
        getUserChats(userId).then((data) => {
          setChatList(data);
        });
      }
    });

    getChat();
    return () => {
      socket?.off("event");
    };
  });

  return (
    <Card className="m-1">
      <CardContent className="flex h-[800px] p-1 space-x-1">
        <ListChannel data={chatList} />
        <MessageArea userId={userId} />
        {chatId && <ListUser data={chatUserList} userId={userId} />}
      </CardContent>
    </Card>
  );
}
