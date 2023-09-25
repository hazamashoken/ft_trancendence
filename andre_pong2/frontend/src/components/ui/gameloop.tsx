'use client';

import { useEffect } from "react";
import { getGameState } from "@/lib/GameState";
import { renderCanvas } from "@/lib/GameRender";

let _timestamp: number = performance.now();
let _animationID: number = 0;

function loop(now: number)
{
	var canvas = document.querySelector('#game_canvas') as HTMLCanvasElement;

  if (canvas != null)
	  renderCanvas(canvas, getGameState(), now - _timestamp);

	_timestamp = now;
	_animationID = window.requestAnimationFrame(loop);
}

export default function GameLoop()
{
  useEffect(() => {
    _animationID = window.requestAnimationFrame(loop);
    return () => { window.cancelAnimationFrame(_animationID); };
  }, []);
  return null;
}
