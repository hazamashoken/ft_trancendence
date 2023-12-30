import GameLoop from "@/components/pong/gameloop";
import { ListChannel } from "../_components/chat/list-channel";
import { MessageArea } from "../_components/chat/message-area";
import Game from "@/components/pong/game";
import { ListUser } from "../_components/chat/list-user";
import { getMatch } from "../_actions/game";
import { notFound } from "next/navigation";

export default async function ChatPage({ params }: { params: { id: number } }) {
  const { id } = params;

  const res = await getMatch(id);
  if (res.error) {
    notFound();
  }

  return (
    <div className="flex justify-between">
      <div className="flex justify-center flex-grow">
        <GameLoop />
        <Game width={"1200"} height={"600"} />
      </div>
    </div>
  );
}
