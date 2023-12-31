import { getMatch } from "../_actions/game";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { GameHeader } from "../_components/game/game-header";
import { PingPong } from "../_components/game/ping-pong";

export default async function GameRoomPage({
  params,
}: {
  params: { id: number };
}) {
  const { id } = params;

  const res = await getMatch(id);
  if (res.error) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col justify-center flex-grow">
      <GameHeader user={session?.user} match={res?.data} />
      <PingPong user={session?.user} match={res?.data} />
    </div>
  );
}
