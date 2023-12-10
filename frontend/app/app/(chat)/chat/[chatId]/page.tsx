import { ListChannel } from "../_components/list-channel";
import { MessageArea } from "./_components/message-area";

export default async function ChatPage({
  params,
}: {
  params: { chatId: string };
}) {
  const { chatId } = params;
  const allChannelRes = await fetch(`${process.env.BACKEND_URL}/channels/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const channelMessageRes = await fetch(
    `${process.env.BACKEND_URL}/channels/all`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const channelListData = await allChannelRes.json();
  const channelMessageData = await channelMessageRes.json();
  return (
    <>
      <ListChannel data={channelListData} />
      <MessageArea chatId={chatId} />
      {/* <UserArea /> */}
    </>
  );
}
