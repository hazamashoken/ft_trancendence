"use client";

import { Card, CardContent } from "@/components/ui/card";

export function LobbyHeader(props: { meStat: any }) {
  const { meStat } = props;
  const { win, lose, winRate, matchs, user } = meStat;

  console.log(meStat);

  return (
    <>
      <Card>
        <CardContent className="">
          <strong>{user.displayName}</strong>
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
    </>
  );
}
