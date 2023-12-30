"use client";

import { useEffect } from "react";
// import { getGameState } from "@/lib/GameState";
import { renderCanvas } from "@/lib/GameRender";
import { GameState } from "@/lib/pong.interface";

let _timestamp: number = performance.now();
let _animationID: number = 0;

export default function GameLoop({ gameState }: { gameState: GameState }) {
  function loop(now: number) {
    let canvas = document.querySelector("#game_canvas") as HTMLCanvasElement;

    if (canvas != null) renderCanvas(canvas, gameState, now - _timestamp);

    _timestamp = now;
    _animationID = window.requestAnimationFrame(loop);
  }

  useEffect(() => {
    // console.log("gameState", gameState);
    _animationID = window.requestAnimationFrame(loop);
    return () => {
      window.cancelAnimationFrame(_animationID);
    };
  }, [gameState]);
  return null;
}
