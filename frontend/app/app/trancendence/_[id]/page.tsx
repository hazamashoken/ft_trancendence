import GameLoop from "@/components/pong/gameloop";
import { ListChannel } from "../_components/list-channel";
import { MessageArea } from "../_components/message-area";
import Game from "@/components/pong/game";
import { ListUser } from "../_components/list-user";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const allChannelRes = await fetch(
    `${process.env.BACKEND_URL}/channels/public`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  // const channelMessageRes = await fetch(
  //   `${process.env.BACKEND_URL}/channels/all`,
  //   {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );

  const channelUserRes = await fetch(
    `${process.env.BACKEND_URL}/channels/${id}/users`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const channelListData = await allChannelRes.json();
  // const channelMessageData = await channelMessageRes.json();
  const channelUserData = await channelUserRes.json();
  return (
    <div className="flex justify-between">
      <div className="flex justify-center flex-grow">
        <GameLoop />
        <Game width={"1200"} height={"600"} />
      </div>
      <div className="flex">
        <ListChannel data={channelListData} />
        <MessageArea chatId={id} />
        <ListUser data={channelUserData} chatId={id} />
      </div>
    </div>
  );
}
