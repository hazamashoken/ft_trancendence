"use client";

import { Fragment, useRef, ElementRef, useEffect } from "react";
import { format } from "date-fns";
// import { Member, Message, Profile } from "@prisma/client";
import { Loader2, ServerCrash } from "lucide-react";

import { ChatWelcome } from "./chat-welcome";
import { ChatItem } from "./chat-item";
import { useQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import ApiClient from "@/app/api/api-client";
import { getDmOther } from "./chat-header";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

type MessageWithMemberWithProfile = any & {
  member: any & {
    profile: any;
  };
};

interface ChatMessagesProps {
  name: string;
  member: any;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
  chatMeta?: any;
  chatId: string;
  userId: string;
}

export const ChatMessages = ({
  name,
  member,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
  chatMeta,
  chatId,
  userId,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);
  const [chatMessages, setChatMessages] = React.useState([]);

  const { isConnected } = useSocket();
  const client = ApiClient("CLIENT");
  const { data, isError, isLoading } = useQuery({
    queryKey: [queryKey],
    enabled: isConnected && !!chatId,
    queryFn: () =>
      client.get(`/channels/${chatId}/messages`).then((res) => res.data),
    // refetchInterval: 1000,
  });

  useEffect(() => {
    if (!data) return;
    setChatMessages(data);
  }, [data, chatId]);

  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  });

  if (!chatId) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 border-x">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          No channel selected...
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 border-x">
        <Loader2 className="my-4 h-7 w-7 text-zinc-500 animate-spin" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 border-x">
        <ServerCrash className="my-4 h-7 w-7 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  if (chatMessages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 border-x">
        <ChatWelcome
          name={
            chatMeta.chatType !== "direct"
              ? chatMeta.name
              : getDmOther(chatMeta.data.chatUsers, userId)?.displayName ??
                "unknown"
          }
          type={chatMeta.chatType}
        />
      </div>
    );
  }

  return (
    <div ref={chatRef} className="h-full py-4 overflow-y-auto border-x">
      <div className="flex flex-col mt-auto">
        {chatMessages?.map((message: any, i: number) => (
          <ChatItem
            key={message.massageId}
            id={message.massageId}
            currentMember={message.athor}
            member={message.athor}
            content={message.message}
            fileUrl={message.fileUrl}
            deleted={message.deleted}
            timestamp={format(new Date(message.createAt), DATE_FORMAT)}
            isUpdated={message.updatedAt}
            socketUrl={socketUrl}
            socketQuery={socketQuery}
          />
        ))}
      </div>
    </div>
  );
};
