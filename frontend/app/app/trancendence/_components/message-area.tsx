"use client";

import { useEffect, useState } from "react";
import { getChannelData, getUserChats } from "../_actions/chat";
import { ChatHeader, getDmOther } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-message";
import { IChatStore, useChatStore } from "@/store/chat";
import { set } from "lodash";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";

export function MessageArea(props: any) {
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

  useEffect(() => {
    if (!chatId) return;
    const getChatMeta = async () => {
      const res = await getChannelData(chatId);
      const data = await res.data;
      setChatMeta({
        id: data?.chatId,
        name: data?.chatName,
        chatType: data?.chatType,
        type: "text",
        data: data,
      });
    };
    getChatMeta();
  }, [chatId]);

  return (
    <div className="w-[350px] h-full flex flex-col justify-between">
      <div className="flex flex-col h-full overflow-hidden">
        <ChatHeader
          type="channel"
          chatId={chatId}
          chatMeta={chatMeta}
          chatUserList={chatUserList}
          userId={userId}
        />
        <ChatMessages
          member={chatUserList}
          name={chatMeta.name}
          type="channel"
          apiUrl={`${process.env.NEXT_PUBLIC_BACKEND_URL}/channels/${chatId}/messages`}
          socketUrl="/api/socket/messages"
          socketQuery={{
            channelId: chatMeta.id,
          }}
          // chatData={chatData}
          paramKey="channelId"
          paramValue={chatMeta.id}
          chatId={chatId}
          chatMeta={chatMeta}
        />
      </div>
      {chatId && (
        <ChatInput
          name={
            chatMeta.chatType === "direct"
              ? getDmOther(chatMeta.data.chatUsers, userId)?.displayName
              : chatMeta.name
          }
          type="channel"
          apiUrl={`${process.env.NEXT_PUBLIC_BACKEND_URL}/channels/${chatId}/createmessage`}
          query={{
            channelId: chatMeta.id,
          }}
          chatId={chatId}
          userId={userId}
        />
      )}
    </div>
  );
}
