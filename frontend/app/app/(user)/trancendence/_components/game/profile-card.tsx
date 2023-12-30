"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createMatch } from "../../_actions/game";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createAbbreviation } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export function ProfileCard(props: { meStat: any; ranking: any }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const { data } = useSession();
  const { meStat, ranking } = props;
  const { win, lose, winRate, matchs, user } = meStat;

  const handleCreateRoom = async () => {
    setIsLoading(true);
    const res = await createMatch().finally(() => setIsLoading(false));
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Created match successfully");
      router.push(`/trancendence/${res.data.matchId}`);
    }
  };

  return (
    <>
      <Card className="container">
        <CardContent className="w-80">
          <strong>
            <pre>
              {Object.entries(data?.user ?? user).map(([key, value], index) => (
                <p key={index}>{`${key}: ${value}`}</p>
              ))}
            </pre>
          </strong>
          <div className="flex flex-col">
            <div className="flex flex-row flex-grow gap-4">
              <div>Win: {win}</div>
              <div>Lose: {lose}</div>
            </div>
            <div className="flex flex-row flex-grow gap-4">
              <div>Matchs: {matchs}</div>
              <div>Win Rate: {winRate}%</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="container flex justify-center">
        <Button onClick={handleCreateRoom} disabled={isLoading}>
          Create Room
        </Button>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-around p-2 text-center">
            <span className="text-lg font-bold ">Ranking</span>
            <span className="text-lg font-bold">Player</span>
            <span className="text-lg font-bold">Win Rate</span>
          </div>
        </CardHeader>
        <ScrollArea className="h-[350px]">
          <div className="flex flex-col justify-around w-full gap-1">
            {ranking.map((rank: any, index: number) => (
              <div className="container" key={index}>
                {index === 0 || <Separator />}
                <div className="flex items-center justify-around p-2 text-center">
                  <Badge variant={"outline"} className="text-lg font-bold ">
                    {index + 1}
                  </Badge>
                  <Avatar>
                    <AvatarImage src={rank?.user?.imageUrl} />
                    <AvatarFallback>
                      {createAbbreviation(rank?.user?.displayName) ?? "unknown"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-bold">{rank.user.displayName}</span>
                  <span>{rank.winRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </>
  );
}
