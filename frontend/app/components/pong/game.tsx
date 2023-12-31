"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
// import { getSocket } from "@/lib/GameState";
import { GameInstruction } from "@/lib/pong.interface";
import { Phase, Team, Keypress } from "@/lib/pong.enum";
import { useGameSocket } from "@/components/providers/game-socket-provider";
import { cx } from "class-variance-authority";

export default function Game(props: any) {
  const { isPlayer } = props;
  const { socket, isConnected } = useGameSocket();
  const [phase, setPhase] = useState(
    props.team == Team.player1 ||
      props.team == Team.player2 ||
      props.team == Team.spectator
      ? Phase.ready
      : Phase.waiting
  );
  const [team, setTeam] = useState(props.team);

  const clickStart = (e: React.MouseEvent<HTMLElement>) => {
    let payload: GameInstruction = { keypress: Keypress.start };

    socket?.emit("pong_keypress", payload);
  };

  const clickStartClassic = (e: React.MouseEvent<HTMLElement>) => {
    let payload: GameInstruction = { keypress: Keypress.start };

    socket?.emit("pong_keypress", payload);
  };

  const clickSuper = (e: React.MouseEvent<HTMLElement>) => {
    let payload: GameInstruction = { keypress: Keypress.super };

    socket?.emit("pong_keypress", payload);
  };

  const sendKeyUp = (e: React.MouseEvent<HTMLElement>) => {
    let payload: GameInstruction = { keypress: Keypress.up };

    socket?.emit("pong_keypress", payload);
  };

  const sendKeyDown = (e: React.MouseEvent<HTMLElement>) => {
    let payload: GameInstruction = { keypress: Keypress.down };

    socket?.emit("pong_keypress", payload);
  };

  const sendKeyRelease = (e: React.MouseEvent<HTMLElement>) => {
    let payload: GameInstruction = { keypress: Keypress.release };

    socket?.emit("pong_keypress", payload);
  };

  const sendKeyStartClassic = (e: React.MouseEvent<HTMLElement>) => {
    let payload: GameInstruction = { keypress: Keypress.refresh };

    socket?.emit("pong_keypress", payload);
  };

  return (
    <div className="flex flex-col items-center">
      <canvas
        id="game_canvas"
        width={props.width ?? "640"}
        height={props.height ?? "480"}
      ></canvas>
      <div
        className={cx({
          "flex flex-row items-center m-1": true,
          hidden: !isPlayer,
        })}
      >
        <Button
          className="mt-1 mb-1 ml-4 mr-4"
          disabled={
            phase == Phase.waiting ||
            phase == Phase.disconnect ||
            team == Team.spectator
          }
          onMouseDown={sendKeyUp}
          onMouseUp={sendKeyRelease}
        >
          ↑
        </Button>
        <Button
          className="mt-1 mb-1 mr-4"
          disabled={
            phase == Phase.waiting ||
            phase == Phase.disconnect ||
            team == Team.spectator
          }
          onMouseDown={sendKeyDown}
          onMouseUp={sendKeyRelease}
        >
          ↓
        </Button>
      </div>
      <div
        className={cx({
          "flex flex-row items-center m-1": true,
          hidden: !isPlayer,
        })}
      >
        <Button
          className="mt-1 mb-1 ml-4 mr-4"
          disabled={
            phase == Phase.waiting ||
            phase == Phase.disconnect ||
            team == Team.spectator
          }
          onClick={clickStart}
        >
          Start Standard
        </Button>
        <Button
          className="mt-1 mb-1 mr-4"
          disabled={
            phase == Phase.waiting ||
            phase == Phase.disconnect ||
            team == Team.spectator
          }
          onClick={clickStartClassic}
        >
          Start Classic
        </Button>
        <Button
          className="mt-1 mb-1 mr-4"
          disabled={
            phase == Phase.waiting ||
            phase == Phase.disconnect ||
            team == Team.spectator
          }
          onClick={clickSuper}
        >
          Super
        </Button>
      </div>
    </div>
  );
}
