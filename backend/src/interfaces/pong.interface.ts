export interface GameUser {
  id: string;
  name: string;
  team: string;
  room: string;
  keypress: string;
}

export interface Vector {
  x: number;
  y: number;
}

export interface GamePlayer {
  position: Vector;
  direction: Vector;
  score: number;
  balls: number;
}

export interface GameBall {
  position: Vector;
  direction: Vector;
  visible: boolean;
}

export interface GameState {
  player1: GamePlayer;
  player2: GamePlayer;
  ball: GameBall;
  multiball: GameBall[];
  serve: number;
  phase: string;
  changed: boolean;
}

export interface GameInstruction {
  keypress: string;
}

export interface PongServerToClientEvents {
  pong_state: (e: GameState) => void;
}

export interface PongClientToServerEvents {
  pong_keypress: (e: GameInstruction) => void;
}
