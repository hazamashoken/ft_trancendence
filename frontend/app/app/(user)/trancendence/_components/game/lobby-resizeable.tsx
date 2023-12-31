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
import { useSession } from "next-auth/react";

export function LobbyResizeable(props: {
  meRes: any;
  matchRes: any;
  rankRes: any;
}) {
  const { meRes, matchRes, rankRes } = props;
  const [matches, setMatches] = React.useState(matchRes.data);
  const [ranks, setRanks] = React.useState(rankRes.data);
  const { data: session } = useSession();

  const matchQuery = useQuery({
    queryKey: ["matches"],
    enabled: !!session?.accessToken,
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matchs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
          "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY as string,
        },
        cache: "no-cache",
      }).then((res) => res.json()),
    refetchInterval: 4000,
  });

  const rankQuery = useQuery({
    queryKey: ["ranks"],
    enabled: !!session?.accessToken,
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stats/rank`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
          "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY as string,
        },
        cache: "no-cache",
      }).then((res) => res.json()),
    refetchInterval: 10000,
  });

  React.useEffect(() => {
    if (matchQuery.isError) return;
    setMatches(matchQuery.data);
  }, [matchQuery]);

  React.useEffect(() => {
    if (rankQuery.isError) return;
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
