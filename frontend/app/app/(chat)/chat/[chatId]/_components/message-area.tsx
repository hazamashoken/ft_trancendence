import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-message";

const getChannel = async (chatId: string = "1") => {
  const res = await fetch(`${process.env.BACKEND_URL}/channels/${chatId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  const data = await res.json();

  return data;
};

export async function MessageArea(props: { chatId: string }) {
  const { chatId } = props;
  const data = await getChannel(chatId);

  const channel = {
    id: data?.chatId,
    name: data?.chatName,
    type: "text",
  };

  return (
    <>
      <ChatHeader name={channel.name} type="channel" />
      <ChatMessages
        member={[]}
        name={channel.name}
        chatId={channel.id}
        type="channel"
        apiUrl={`${process.env.BACKEND_URL}/channels/${chatId}/messages`}
        socketUrl="/api/socket/messages"
        socketQuery={{
          channelId: channel.id,
        }}
        paramKey="channelId"
        paramValue={channel.id}
      />
      <ChatInput
        name={channel.name}
        type="channel"
        apiUrl={`${process.env.BACKEND_URL}/channels/${chatId}/createmessage`}
        query={{
          channelId: channel.id,
        }}
        chatId={data?.chatId}
      />
    </>
  );
}
