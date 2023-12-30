import GameLoop from "@/components/pong/gameloop";
import { ListChannel } from "../_components/chat/list-channel";
import { MessageArea } from "../_components/chat/message-area";
import Game from "@/components/pong/game";
import { ListUser } from "../_components/chat/list-user";
import { getMatch } from "../_actions/game";
import { notFound } from "next/navigation";
import { getGameState } from "@/lib/GameState";
import { Team } from "@/lib/pong.enum";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function ChatPage({ params }: { params: { id: number } }) {
  const { id } = params;

  const res = await getMatch(id);
  if (res.error) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const gameState = getGameState();
  const userName = session?.user?.intraLogin;
  let userTeam:string = '';
  if (gameState.player1.name == userName)
    userTeam = Team.player1;
  if (gameState.player2.name == userName)
    userTeam = Team.player2;

  return (
    <div className="flex justify-between">
      <div className="flex justify-center flex-grow">
        <GameLoop />
        <Game width={"1200"} height={"600"} team={userTeam} />
      </div>
    </div>
  );
}
