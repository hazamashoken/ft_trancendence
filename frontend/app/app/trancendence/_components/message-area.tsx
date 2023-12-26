"use client";

import { useEffect, useState } from "react";
import { getChannelData } from "../_actions/chat";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-message";

export function MessageArea(props: { chatId: string }) {
  const { chatId } = props;
  const [chatMeta, setChatMeta] = useState({
    chatId: "1",
    chatName: "General",
  });

  useEffect(() => {
    const getChatMeta = async () => {
      const data = await getChannelData(chatId);
      setChatMeta(data);
    };
    getChatMeta();
  }, [chatId]);

  const channel = {
    id: chatMeta?.chatId,
    name: chatMeta?.chatName,
    type: "text",
  };

  return (
    <div className="w-[350px]">
      <ChatHeader name={channel.name} type="channel" />
      <ChatMessages
        member={[]}
        name={channel.name}
        chatId={channel.id}
        type="channel"
        apiUrl={`${process.env.NEXT_PUBLIC_BACKEND_URL}/channels/${chatId}/messages`}
        socketUrl="/api/socket/messages"
        socketQuery={{
          channelId: channel.id,
        }}
        // chatData={chatData}
        paramKey="channelId"
        paramValue={channel.id}
      />
      <ChatInput
        name={channel.name}
        type="channel"
        apiUrl={`${process.env.NEXT_PUBLIC_BACKEND_URL}/channels/${chatId}/createmessage`}
        query={{
          channelId: channel.id,
        }}
        chatId={chatMeta?.chatId}
      />
    </div>
  );
}
