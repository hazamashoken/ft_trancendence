"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { leaveMatch } from "../../_actions/game";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { GameSocketIndicator } from "@/components/socket-indicator";
import { useGameSocket } from "@/components/providers/game-socket-provider";
import { cx } from "class-variance-authority";
import { ReactNode } from "react";

export function GameHeader(props: any) {
  const { user, match } = props;
  const router = useRouter();
  const { isConnected } = useGameSocket();

  const handleLeave = async () => {
    if (user?.id !== match?.player1?.id && user?.id !== match?.player2?.id)
      return router.push("/trancendence");

    const res = await leaveMatch(match?.matchId);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Left match successfully");
      router.push("/trancendence");
    }
  };

  const thingsToNotShow = [
    "intraUrl",
    "imageUrl",
    "createdAt",
    "updatedAt",
    "id",
  ];

  return (
    <>
      <div className="flex justify-around">
        <div className="flex flex-col items-center">
          <Avatar className="w-16 h-16">
            <AvatarImage src={match?.player1?.imageUrl} />
            <AvatarFallback>
              {match?.player1?.displayName ?? "-"}
            </AvatarFallback>
          </Avatar>
          <Badge>{match?.player1?.displayName ?? "-"}</Badge>
          <pre className="text-center">
            {Object.entries(match?.player1)
              ?.filter(
                ([key, value]) => thingsToNotShow.includes(key) === false
              )
              .map(([key, value], index) => {
                if (key === "stats") {
                  return (
                    <pre key={index}>
                      {Object.entries(value ?? [])
                        ?.filter(
                          ([key, value]) =>
                            thingsToNotShow.includes(key) === false
                        )
                        .map(([key, value], index) => (
                          <p key={index}>
                            <span className="font-bold">{key}</span> :{" "}
                            <span>{value}</span>
                          </p>
                        ))}
                    </pre>
                  );
                }
                return (
                  <p key={index}>
                    <span className="font-bold">{key}</span> :{" "}
                    <span>{(value as ReactNode) ?? "-"}</span>
                  </p>
                );
              })}
          </pre>
        </div>
        <div className="flex flex-col gap-2 w-[200px] justify-center items-center">
          <Button
            className={cx({
              "bg-green-500": isConnected,
              "bg-red-500": !isConnected,
            })}
          >
            {match?.status}
          </Button>
          <Button size={"sm"} variant={"destructive"} onClick={handleLeave}>
            Leave
          </Button>
        </div>
        <div className="flex flex-col items-center">
          <Avatar className="w-16 h-16">
            <AvatarImage src={match?.player2?.imageUrl} />
            <AvatarFallback>
              {match?.player2?.displayName ?? "-"}
            </AvatarFallback>
          </Avatar>
          <Badge>{match?.player2?.displayName ?? "-"}</Badge>
          <pre className="text-center">
            {Object.entries(match?.player2)
              ?.filter(
                ([key, value]) => thingsToNotShow.includes(key) === false
              )
              .map(([key, value], index) => {
                if (key === "stats") {
                  return (
                    <pre key={index}>
                      {Object.entries(value ?? [])
                        ?.filter(
                          ([key, value]) =>
                            thingsToNotShow.includes(key) === false
                        )
                        .map(([key, value], index) => (
                          <p key={index}>
                            <span className="font-bold">{key}</span> :{" "}
                            <span>{value}</span>
                          </p>
                        ))}
                    </pre>
                  );
                }
                return (
                  <p key={index}>
                    <span className="font-bold">{key}</span> :{" "}
                    <span>{(value as ReactNode) ?? "-"}</span>
                  </p>
                );
              })}
          </pre>
        </div>
      </div>
    </>
  );
}
