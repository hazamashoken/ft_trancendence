"use client";

import { ListChannel } from "./list-channel";
import { MessageArea } from "./message-area";
import { ListUser } from "./list-user";

import { useChatStore, IChatStore } from "@/store/chat";
import { useEffect } from "react";
import { getChatUser, getPublicChat } from "../_actions/chat";

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
        getPublicChat(),
        getChatUser(chatId),
      ]);
      setChatList(channelListData);
      setChatUserList(channelUserData);
    };
    getChat();
  }, [setChatList, setChatUserList, chatId]);

  return (
    <div className="flex">
      <ListChannel data={chatList} />
      <MessageArea chatId={chatId} />
      <ListUser data={chatUserList} chatId={chatId} />
    </div>
  );
}
