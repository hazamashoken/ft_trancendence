import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/authOptions";
import { DataTable } from "./_components/game/game-table";
import { Match, columns } from "./_components/game/game-columns";
import { getMatchs } from "./_actions/game";
import { LobbyHeader } from "./_components/game/lobby-header";
import { getMeStat } from "./_actions/stats";

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
    <div className="flex justify-center w-full">
      <LobbyHeader meStat={meRes.data} />
      <DataTable columns={columns} data={matchRes.data} />
    </div>
  );
}
