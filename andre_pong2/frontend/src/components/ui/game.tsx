'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import { getSocket } from "@/lib/GameState";
import { GameInstruction } from "@/lib/pong.interface";
import { Phase, Team, Keypress } from "@/lib/pong.enum"

export default function Game(props: any) {
  const [phase, setPhase] = useState(props.team == Team.player1 || props.team == Team.player2 ? Phase.ready : Phase.waiting);
  const [team, setTeam] = useState(props.team);

  const clickteam1 = (e: React.MouseEvent<HTMLElement>) =>
  {
    var payload: GameInstruction = { keypress: Keypress.player1 };

    setPhase(Phase.ready);
    setTeam(Keypress.player1);
    getSocket().emit('pong_keypress', payload);
  }

  const clickteam2 = (e: React.MouseEvent<HTMLElement>) =>
  {
    var payload: GameInstruction = { keypress: Keypress.player2 };

    setPhase(Phase.ready);
    setTeam(Keypress.player2);
    getSocket().emit('pong_keypress', payload);
  }

  const clickStart = (e: React.MouseEvent<HTMLElement>) =>
  {
    var payload: GameInstruction = { keypress: Keypress.start };
  
    getSocket().emit('pong_keypress', payload);
  }

  const sendKeyUp = (e: React.MouseEvent<HTMLElement>) =>
  {
    var payload: GameInstruction = { keypress: Keypress.up };

    getSocket().emit('pong_keypress', payload);
  }

  const sendKeyDown = (e: React.MouseEvent<HTMLElement>) =>
  {
    var payload: GameInstruction = { keypress: Keypress.down };

    getSocket().emit('pong_keypress', payload);
  }

  const sendKeyRelease = (e: React.MouseEvent<HTMLElement>) =>
  {
    var payload: GameInstruction = { keypress: Keypress.release };

    getSocket().emit('pong_keypress', payload);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row items-center m-1">
        <Button className="mt-1 mb-1 ml-4 mr-4" variant={team != Team.player2 ? "default" : "outline"} disabled={phase != Phase.waiting} onClick={clickteam1}>Player 1</Button>
        <Button className="mt-1 mb-1 mr-4 mr-4" variant={team != Team.player1 ? "default" : "outline"} disabled={phase != Phase.waiting} onClick={clickteam2}>Player 2</Button>
      </div>
      <canvas id='game_canvas' width='640' height='480'></canvas>
      <div className="flex flex-row items-center m-1">
        <Button className="mt-1 mb-1 ml-4 mr-4" disabled={phase == Phase.waiting} onMouseDown={sendKeyUp} onMouseUp={sendKeyRelease}>Up</Button>
        <Button className="mt-1 mb-1 mr-4 mr-4" disabled={phase == Phase.waiting} onMouseDown={sendKeyDown} onMouseUp={sendKeyRelease}>Dn</Button>
      </div>
      <Button className="mt-1 mb-1 ml-4 mr-4" disabled={phase == Phase.waiting} onClick={clickStart}>Start</Button>
    </div>
  )
}
