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

export function ChatBox(props: { userId: string }) {
  const { userId } = props;
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
      getUserChats(userId).then((res) => {
        setChatList(res.data);
      });
      if (!chatId) return;
      getChatUser(chatId).then((res) => {
        setChatUserList(res.data);
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
        if (res.chatId === chatId.toString()) {
          queryClient.invalidateQueries({ queryKey: [`chat:${chatId}`] });
        }
      } else if (res.event === "chat updated") {
        getUserChats(userId).then((res) => {
          setChatList(res.data);
        });
      } else if (res.event === "dmCreated") {
        getUserChats(userId).then((res) => {
          setChatList(res.data);
        });
      }
    });

    getChat();
    return () => {
      socket?.off("event");
    };
  }, [chatId]);

  return (
    <Card className="m-1">
      <CardContent className="flex h-[800px] p-1 space-x-1">
        <ListChannel data={chatList} userId={userId} />
        <MessageArea userId={userId} />
        {chatId && chatMeta.chatType && chatMeta.chatType !== "direct" && (
          <ListUser data={chatUserList} userId={userId} />
        )}
      </CardContent>
    </Card>
  );
}
