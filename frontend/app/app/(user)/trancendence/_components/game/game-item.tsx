"use client";

import React from "react";
import { TMatch } from "./game-columns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { PlayerAvatar } from "./player-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { joinMatch } from "../../_actions/game";
import { toast } from "sonner";

export function MatchItem(props: any) {
  const { matchId, player1, player2, status, id } = props;
  const router = useRouter();
  const [isJoining, setIsJoining] = React.useState(false);

  const handleJoin = async () => {
    setIsJoining(true);
    router.push(`/trancendence/${matchId}`);
    const res = await joinMatch(matchId);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Joined match successfully");
    }
    setIsJoining(false);
  };
  const handleWatch = async () => {};

  const isFull = player1 && player2;

  return (
    <Card className="container">
      <CardHeader>
        <span className="flex justify-around text-xl font-bold text-center">
          <span>{player1?.displayName ?? "-"}</span>
          <span>vs</span>
          <span>{player2?.displayName ?? "-"}</span>
        </span>
      </CardHeader>
      <CardContent className="flex items-center justify-around">
        {player1 ? (
          <PlayerAvatar {...player1} />
        ) : (
          <Button
            className="w-[80px] rounded-full h-[80px]"
            onClick={handleJoin}
            variant={"outline"}
            disabled={isFull || isJoining}
          >
            Join
          </Button>
        )}
        <div className="flex flex-col items-center justify-center gap-4">
          <Button variant={"outline"} className="w-[150px]">
            <strong className="text-lg"> {status}</strong>
          </Button>
          <div className="space-x-2">
            <Button className="w-[80px]" onClick={handleWatch}>
              Watch
            </Button>
          </div>
        </div>
        {player2 ? (
          <PlayerAvatar {...player2} />
        ) : (
          <Button
            className="w-[80px] rounded-full h-[80px]"
            variant={"outline"}
            onClick={handleJoin}
            disabled={isFull || isJoining}
          >
            Join
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
}
