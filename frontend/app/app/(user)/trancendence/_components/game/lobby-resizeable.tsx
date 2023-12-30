"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ProfileCard } from "./profile-card";
import { GameLobby } from "./game-lobby";
import { useQuery } from "@tanstack/react-query";
import ApiClient from "@/app/api/api-client";
import React from "react";

export function LobbyResizeable(props: {
  meRes: any;
  matchRes: any;
  rankRes: any;
}) {
  const { meRes, matchRes, rankRes } = props;
  const client = ApiClient("CLIENT");

  const [matches, setMatches] = React.useState(matchRes.data);
  const [ranks, setRanks] = React.useState(rankRes.data);

  const matchQuery = useQuery({
    queryKey: ["matches"],
    queryFn: () => client.get(`/matchs`).then((res) => res.data),
    refetchInterval: 4000,
  });
  const rankQuery = useQuery({
    queryKey: ["ranks"],
    queryFn: () => client.get(`/stats/rank`).then((res) => res.data),
    refetchInterval: 10000,
  });

  React.useEffect(() => {
    if (!matchQuery.data) return;
    setMatches(matchQuery.data);
  }, [matchQuery]);

  React.useEffect(() => {
    if (!rankQuery.data) return;
    setRanks(rankQuery.data);
  }, [rankQuery]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="flex justify-center w-full"
    >
      <ResizablePanel defaultSize={50}>
        <ProfileCard meStat={meRes.data} ranking={ranks} />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <GameLobby data={matches} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
