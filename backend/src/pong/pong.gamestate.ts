import { GameState } from '../interfaces/pong.interface';
import { Pong, Phase } from './pong.enum';

export function newGameState(): GameState {
  const state: GameState = {
    player1: {
      position: { x: -Pong.BAT_OFFSET, y: 0.5 },
      direction: { x: 0, y: 0 },
      score: 0,
      powerup: false,
      multiballs: 3,
      powerups: 3,
    },
    player2: {
      position: { x: Pong.BAT_OFFSET, y: 0.5 },
      direction: { x: 0, y: 0 },
      score: 0,
      powerup: false,
      multiballs: 3,
      powerups: 3,
    },
    ball: {
      position: { x: 0, y: 0.5 },
      direction: { x: 0, y: 0 },
      visible: false,
    },
    multiball: [],
    serve: 1,
    phase: Phase.waiting,
    continue: true,
    changed: false,
  };

  return state;
}
