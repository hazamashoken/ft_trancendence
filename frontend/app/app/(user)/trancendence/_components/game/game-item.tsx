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
import { joinMatch, watchGame } from "../../_actions/game";
import { toast } from "sonner";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function MatchItem(props: any) {
  const { matchId, player1, player2, status, id } = props;
  const router = useRouter();
  const [isJoining, setIsJoining] = React.useState(false);
  const { data: session } = useSession();

  const handleJoin = async () => {
    setIsJoining(true);
    const res = await joinMatch(matchId);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Joined match successfully");
      router.push(`/trancendence/${matchId}`);
    }
    setIsJoining(false);
  };
  const handleWatch = async () => {
    const res = await watchGame(matchId);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Watching match successfully");
      router.push(`/trancendence/${matchId}`);
    }
  };

  const isFull = player1 && player2;
  const isPlayer =
    session?.user?.id === player1?.id || session?.user?.id === player2?.id;

  const isFinished = status === "FINISHED";

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
          {isFinished || (
            <div className="space-x-2">
              {isPlayer ? (
                <Link href={`/trancendence/${matchId}`}>
                  <Button className="w-[80px]">Rejoin</Button>
                </Link>
              ) : (
                <Button className="w-[80px]" onClick={handleWatch}>
                  Watch
                </Button>
              )}
            </div>
          )}
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
