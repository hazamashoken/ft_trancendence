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

export function ChatBox() {
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
      getUserChats("4").then((data) => {
        setChatList(data);
      });
      if (!chatId) return;
      getChatUser(chatId).then((data) => {
        setChatUserList(data);
      });
    };

    socket?.on("event", (res: any) => {
      console.log("event", res);
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
        queryClient.invalidateQueries({ queryKey: [`chat:${chatId}`] });
      } else if (res.event === "chat updated") {
        getUserChats("4").then((data) => {
          setChatList(data);
        });
      }
    });

    getChat();
    console.log(chatList);
    return () => {
      socket?.off("event");
    };
  }, [chatId]);

  return (
    <Card className="m-1">
      <CardContent className="flex h-[800px] p-1 space-x-1">
        <ListChannel data={chatList} />
        <MessageArea />
        {chatId && <ListUser data={chatUserList} />}
      </CardContent>
    </Card>
  );
}
