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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <Tabs defaultValue="1">
        <TabsList>
          <TabsTrigger value="1">WAITING</TabsTrigger>
          <TabsTrigger value="2">ON GOING</TabsTrigger>
          <TabsTrigger value="3">DONE</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <ScrollArea className="border rounded-md">
            <div className="space-y-1 h-[785px]">
              {data
                ?.filter(
                  (match) =>
                    match.status === "WAITING" || match.status === "STARTING"
                )
                .map((match, index) => (
                  <MatchItem key={index} {...match} />
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="2">
          <ScrollArea className="border rounded-md">
            <div className="space-y-1 h-[785px]">
              {data
                ?.filter((match) => match.status === "PLAYING")
                .map((match, index) => (
                  <MatchItem key={index} {...match} />
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="3">
          <ScrollArea className="border rounded-md">
            <div className="space-y-1 h-[785px]">
              {data
                ?.filter((match) => match.status === "FINISHED")
                .map((match, index) => (
                  <MatchItem key={index} {...match} />
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
