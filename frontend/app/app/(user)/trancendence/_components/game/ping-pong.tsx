"use client";

import GameLoop from "@/components/pong/gameloop";
import Game from "@/components/pong/game";
// import { getGameState } from "@/lib/GameState";
import { Team } from "@/lib/pong.enum";
import React from "react";
import { useGameSocket } from "@/components/providers/game-socket-provider";
import { GameState } from "@/lib/pong.interface";
import { newGameState } from "@/lib/pong.gamestate";

export function PingPong(props: any) {
  const { user, match } = props;
  const { isConnected, socket } = useGameSocket();
  const [userTeam, setUserTeam] = React.useState(Team.player1);
  const [gameState, setGameState] = React.useState<GameState>(newGameState());

  React.useEffect(() => {
    socket?.on("pong_state", (data: GameState) => {
      setGameState(data);
    });
    const userName = user?.intraLogin;
    if (gameState?.player1?.name == userName) setUserTeam(Team.player1);
    if (gameState?.player2?.name == userName) setUserTeam(Team.player2);
  }, [socket, isConnected]);

  return (
    <>
      <GameLoop gameState={gameState} />
      <Game
        width={"1200"}
        height={"600"}
        // gameState={gameState}
        // player={session?.user}
        team={userTeam}
      />
    </>
  );
}
