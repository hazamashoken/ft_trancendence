"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createMatch } from "../../_actions/game";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function ProfileCard(props: { meStat: any }) {
  const { data } = useSession();
  const { meStat } = props;
  const { win, lose, winRate, matchs, user } = meStat;
  const router = useRouter();

  const handleCreateRoom = async () => {
    const res = await createMatch();
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
      <Card>
        <Button onClick={handleCreateRoom}>Create Room</Button>
      </Card>
    </>
  );
}
