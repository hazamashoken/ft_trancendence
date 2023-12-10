export enum Phase
{
  waiting = 'W',
  readyP1 = 'R1',
  readyP2 = 'R2',
  ready = 'R',
  countdown = 'C',
  play = 'P',
  finish = 'F',
};

export enum Team
{
  viewer = 'V',
  player1 = 'P1',
  player2 = 'P2',
}

export enum Keypress
{
  viewer = 'V',
  player1 = 'P1',
  player2 = 'P2',
  start = 'S',
  up = 'U',
  down = 'D',
  release = '-',
  refresh = 'R',
};

export enum Pong
{
  SQUARE_SIZE = 0.02,
  SCORE_OFFSET = 0.1,
  BAT_OFFSET = 0.5,
  BAT_SPEED = 0.2,
  BAT_SIZE = 5,
  BALL_SPEED = 0.5,
};
