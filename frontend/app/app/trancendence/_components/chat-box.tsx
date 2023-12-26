"use client";

import { ListChannel } from "./list-channel";
import { MessageArea } from "./message-area";
import { ListUser } from "./list-user";

import { useChatStore, IChatStore } from "@/store/chat";
import { useEffect } from "react";
import { getChatUser, getPublicChat, getUserChats } from "../_actions/chat";
import { Card, CardContent } from "@/components/ui/card";

export function ChatBox() {
  const [chatId, chatList, chatUserList, setChatList, setChatUserList] =
    useChatStore((state: IChatStore) => [
      state.chatId,
      state.chatList,
      state.chatUserList,
      state.setChatList,
      state.setChatUserList,
    ]);

  useEffect(() => {
    const getChat = async () => {
      const [channelListData, channelUserData] = await Promise.all([
        getUserChats("4"),
        getChatUser(chatId),
      ]);
      setChatList(channelListData);
      setChatUserList(channelUserData);
    };
    getChat();
  }, [setChatList, setChatUserList, chatId]);

  return (
    <Card className="m-1">
      <CardContent className="flex h-[800px] p-1 space-x-1">
        <ListChannel data={chatList} />
        <MessageArea chatId={chatId} />
        <ListUser data={chatUserList} chatId={chatId} />
      </CardContent>
    </Card>
  );
}
