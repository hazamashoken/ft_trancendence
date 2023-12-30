"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ProfileCard } from "./profile-card";
import { GameLobby } from "./game-lobby";

export function LobbyResizeable(props: { meRes: any; matchRes: any }) {
  const { meRes, matchRes } = props;
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="flex justify-center w-full"
    >
      <ResizablePanel defaultSize={50}>
        <ProfileCard meStat={meRes.data} />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <GameLobby data={matchRes.data} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
