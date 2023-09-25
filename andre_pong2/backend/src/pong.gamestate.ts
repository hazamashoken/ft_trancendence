import { GameState } from "./pong.interface";
import { Pong, Phase } from "./pong.enum";

export function newGameState()
: GameState
{
  let state: GameState = {
    player1: {
      position: { x: -Pong.BAT_OFFSET, y: 0.5, },
      direction: { x: 0, y: 0, },
      score: 0,
    },
    player2: {
      position: { x: Pong.BAT_OFFSET, y: 0.5, },
      direction: { x: 0, y: 0, },
      score: 0,
    },
    ball: {
      position: { x: 0, y: 0.5, },
      direction: { x: 0, y: 0, },
      visible: false,
    },
    serve: 1,
    phase: Phase.waiting,
    changed: false,
  };

  return state;
}
