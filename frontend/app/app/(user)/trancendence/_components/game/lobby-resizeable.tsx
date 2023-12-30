"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ProfileCard } from "./profile-card";
import { GameLobby } from "./game-lobby";

export function LobbyResizeable(props: {
  meRes: any;
  matchRes: any;
  rankRes: any;
}) {
  const { meRes, matchRes, rankRes } = props;
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="flex justify-center w-full"
    >
      <ResizablePanel defaultSize={50}>
        <ProfileCard meStat={meRes.data} ranking={rankRes.data} />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <GameLobby data={matchRes.data} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
