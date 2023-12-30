import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/authOptions";
import { DataTable } from "./_components/game/game-table";
import { TMatch, columns } from "./_components/game/game-columns";
import { getMatchs } from "./_actions/game";

import { getMeStat, getRank } from "./_actions/stats";

import { LobbyResizeable } from "./_components/game/lobby-resizeable";

export default async function LobbyPage() {
  const [meRes, matchRes, rankRes] = await Promise.all([
    getMeStat(),
    getMatchs(),
    getRank(),
  ]);

  return (
    <div className="w-full">
      <LobbyResizeable meRes={meRes} matchRes={matchRes} rankRes={rankRes} />;
    </div>
  );
}
