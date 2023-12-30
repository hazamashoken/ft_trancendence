import { ScrollArea } from "@/components/ui/scroll-area";
import { DataTable } from "./game-table";
import { TMatch } from "./game-columns";
import { MatchItem } from "./game-item";
import { Card } from "@/components/ui/card";

export function GameLobby(props: { data: TMatch[] }) {
  // const { data } = props;

  const data = [
    {
      matchId: 1,
      player1: "player1",
      player2: "player2",
      status: "pending",
    },
    {
      matchId: 1,
      player1: "player1",
      player2: "player2",
      status: "pending",
    },
    {
      matchId: 1,
      player1: "player1",
      player2: "player2",
      status: "pending",
    },
    {
      matchId: 1,
      player1: "player1",
      player2: "player2",
      status: "pending",
    },
    {
      matchId: 1,
      player1: "player1",
      player2: "player2",
      status: "pending",
    },
    {
      matchId: 1,
      player1: "player1",
      player2: null,
      status: "pending",
    },
    {
      matchId: 1,
      player1: "player1",
      player2: "player2",
      status: "pending",
    },
    {
      matchId: 1,
      player1: "player1",
      player2: "player2",
      status: "pending",
    },
    {
      matchId: 1,
      player1: "player1",
      player2: "player2",
      status: "pending",
    },
    {
      matchId: 1,
      player1: "player1",
      player2: "player2",
      status: "pending",
    },
    {
      matchId: 1,
      player1: "player1",
      player2: "player2",
      status: "pending",
    },
    {
      matchId: 1,
      player1: "player1",
      player2: "player2",
      status: "pending",
    },
    {
      matchId: 1,
      player1: "player1",
      player2: "player2",
      status: "pending",
    },
    {
      matchId: 1,
      player1: "player1",
      player2: "player2",
      status: "pending",
    },
    {
      matchId: 1,
      player1: "player1",
      player2: "player2",
      status: "pending",
    },
  ];
  return (
    <Card className="container py-4">
      <ScrollArea className="border rounded-md">
        <div className="space-y-1 h-[800px]">
          {data.map((match, index) => (
            <MatchItem key={index} {...match} />
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
