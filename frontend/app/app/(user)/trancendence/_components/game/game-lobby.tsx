"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DataTable } from "./game-table";
import { TMatch } from "./game-columns";
import { MatchItem } from "./game-item";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createMatch } from "../../_actions/game";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import React from "react";

export function GameLobby(props: { data: TMatch[] }) {
  const { data } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
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
    <Card className="container py-4">
      <Button onClick={handleCreateRoom} disabled={isLoading}>
        Create Room
      </Button>
      <ScrollArea className="border rounded-md">
        <div className="space-y-1 h-[785px]">
          {data.map((match, index) => (
            <MatchItem key={index} {...match} />
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
