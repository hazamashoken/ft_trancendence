import { GameState } from "../interfaces/pong.interface";
import { Pong, Phase } from "./pong.enum";

export function newGameState()
: GameState
{
  let state: GameState = {
    player1: {
      position: { x: -Pong.BAT_OFFSET, y: 0.5, },
      direction: { x: 0, y: 0, },
      score: 0,
      balls: 3,
    },
    player2: {
      position: { x: Pong.BAT_OFFSET, y: 0.5, },
      direction: { x: 0, y: 0, },
      score: 0,
      balls: 3,
    },
    ball: {
      position: { x: 0, y: 0.5, },
      direction: { x: 0, y: 0, },
      visible: false,
    },
    multiball: [],
    serve: 1,
    phase: Phase.waiting,
    changed: false,
  };

  return state;
}
