import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/authOptions";
import { DataTable } from "./_components/game/game-table";
import { TMatch, columns } from "./_components/game/game-columns";
import { getMatchs } from "./_actions/game";

import { getMeStat } from "./_actions/stats";

import { LobbyResizeable } from "./_components/game/lobby-resizeable";

export default async function LobbyPage() {
  const [meRes, matchRes] = await Promise.all([getMeStat(), getMatchs()]);

  // const data: Match[] = [
  //   {
  //     matchId: 1,
  //     player1: "player1",
  //     player2: "player2",
  //     status: "WAITING",
  //   },
  //   {
  //     matchId: 2,
  //     player1: "player1",
  //     player2: "player2",
  //     status: "WAITING",
  //   },
  //   {
  //     matchId: 3,
  //     player1: "player1",
  //     player2: "player2",
  //     status: "WAITING",
  //   },
  //   {
  //     matchId: 4,
  //     player1: "player1",
  //     player2: "player2",
  //     status: "WAITING",
  //   },
  // ];

  // console.log(data);

  return (
    <div className="w-full">
      <LobbyResizeable meRes={meRes} matchRes={matchRes} />;
    </div>
  );
}
