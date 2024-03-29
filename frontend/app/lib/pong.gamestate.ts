import { GameState } from "@/lib/pong.interface";
import { Pong, Phase } from "@/lib/pong.enum";

export function newGameState()
: GameState
{
  let state: GameState = {
    room: '',
    player1: {
      name: '',
      position: { x: -Pong.BAT_OFFSET, y: 0.5, },
      direction: { x: 0, y: 0, },
      score: 0,
      powerup: false,
      multiballs: 3,
      powerups: 3,
    },
    player2: {
      name: '',
      position: { x: Pong.BAT_OFFSET, y: 0.5, },
      direction: { x: 0, y: 0, },
      score: 0,
      powerup: false,
      multiballs: 3,
      powerups: 3,
    },
    ball: {
      position: { x: 0, y: 0.5, },
      direction: { x: 0, y: 0, },
      visible: false,
    },
    multiball: [],
    serve: 1,
    phase: Phase.waiting,
    continue: false,
    changed: false,
  };

  return state;
}
