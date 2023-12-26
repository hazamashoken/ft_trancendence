"use client";

import { Fragment, useRef, ElementRef, useEffect } from "react";
import { format } from "date-fns";
// import { Member, Message, Profile } from "@prisma/client";
import { Loader2, ServerCrash } from "lucide-react";

import { useChatQuery } from "@/lib/hooks/use-chat-query";
// import { useChatSocket } from "@/lib/hooks/use-chat-socket";
// import { useChatScroll } from "@/lib/hooks/use-chat-scroll";

import { ChatWelcome } from "./chat-welcome";
import { ChatItem } from "./chat-item";
import { useQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

type MessageWithMemberWithProfile = any & {
  member: any & {
    profile: any;
  };
};

interface ChatMessagesProps {
  name: string;
  member: any;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
  chatData?: any;
}

export const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
  chatData,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);
  const [chatMessages, setChatMessages] = React.useState([]);

  const { isConnected } = useSocket();

  console.log(isConnected);

  const { data, status } = useQuery({
    queryKey: [queryKey],
    enabled: isConnected,
    queryFn: () =>
      fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
  });

  useEffect(() => {
    if (!data) return;
    data.reverse();
    setChatMessages(data);
  }, [data]);

  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  });

  if (status === "pending") {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <Loader2 className="my-4 h-7 w-7 text-zinc-500 animate-spin" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <ServerCrash className="my-4 h-7 w-7 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div
      ref={chatRef}
      className="flex flex-col flex-1 py-4 overflow-y-auto h-[750px]"
    >
      <div className="flex flex-col-reverse mt-auto">
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
      <div ref={bottomRef} />
    </div>
  );
};
