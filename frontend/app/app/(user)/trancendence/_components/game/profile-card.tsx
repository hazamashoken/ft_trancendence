"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useSession } from "next-auth/react";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createAbbreviation } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function ProfileCard(props: { meStat: any; ranking: any }) {
  const { data } = useSession();
  const { meStat, ranking } = props;
  const { win, lose, winRate, matchs, user } = meStat;

  return (
    <>
      <Card className="container">
        <CardContent className="w-80">
          <CardHeader>
            <CardTitle className="text-lg font-bold">My Profile</CardTitle>
          </CardHeader>
          <strong>
            <pre>
              {Object.entries(data?.user ?? user)?.map(
                ([key, value], index) => (
                  <p key={index}>{`${key}: ${value}`}</p>
                )
              )}
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
            {ranking?.map((rank: any, index: number) => (
              <div className="container " key={index}>
                {index === 0 || <Separator />}
                <Link href={`/user/${rank?.user?.id}`}>
                  <div className="flex items-center justify-around p-2 text-center hover:bg-slate-400">
                    <Badge variant={"outline"} className="text-lg font-bold ">
                      {index + 1}
                    </Badge>
                    <Avatar>
                      <AvatarImage src={rank?.user?.imageUrl} />
                      <AvatarFallback>
                        {createAbbreviation(rank?.user?.displayName) ??
                          "unknown"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-bold">{rank.user.displayName}</span>
                    <span>{rank.winRate}%</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </>
  );
}
