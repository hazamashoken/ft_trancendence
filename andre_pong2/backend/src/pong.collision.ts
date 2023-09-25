import { GameState } from './pong.interface';
import { Pong, Team } from './pong.enum';

export function collision(state: GameState, delta: number)
{
  var halfsquare: number = Pong.SQUARE_SIZE / 2;
  var halfbat: number = Pong.SQUARE_SIZE * Pong.BAT_SIZE / 2;
  var seconds: number = delta / 1000;

  // move all objects
  state.player1.position.y += (seconds * Pong.BAT_SPEED * state.player1.direction.y);
  state.player2.position.y += (seconds * Pong.BAT_SPEED * state.player2.direction.y);
  state.ball.position.x += (seconds * Pong.BALL_SPEED * state.ball.direction.x);
  state.ball.position.y += (seconds * Pong.BALL_SPEED * state.ball.direction.y);

  // bat with wall collision
  if (state.player1.position.y < halfbat)
    state.player1.position.y = halfbat;
  if (state.player1.position.y > 1 - halfbat)
    state.player1.position.y = 1 - halfbat;

  if (state.player2.position.y < halfbat)
    state.player2.position.y = halfbat;
  if (state.player2.position.y > 1 - halfbat)
    state.player2.position.y = 1 - halfbat;

  // ball with wall collision
  if (state.ball.position.y < halfsquare)
  {
    state.ball.position.y = halfsquare;
    state.ball.direction.y = -state.ball.direction.y;
    state.changed = true;
  }
  else if (state.ball.position.y > 1 - halfsquare)
  {
    state.ball.position.y = 1 - halfsquare;
    state.ball.direction.y = -state.ball.direction.y;
    state.changed = true;
  }

  // ball with bat collision
  if (state.ball.position.x - halfsquare < state.player1.position.x + halfsquare &&
      state.ball.position.x - halfsquare > state.player1.position.x)
  {
    if ((state.ball.position.y - halfsquare < state.player1.position.y + halfbat &&
        state.ball.position.y - halfsquare > state.player1.position.y - halfbat) ||
        (state.ball.position.y + halfsquare < state.player1.position.y + halfbat &&
        state.ball.position.y + halfsquare > state.player1.position.y - halfbat))
    {
      state.ball.position.x = state.player1.position.x + Pong.SQUARE_SIZE;
      state.ball.direction.x = -state.ball.direction.x;
      // change the direction of the ball if the bat is moving
      if (state.player1.direction.y != 0)
      {
        // add half the bat speed to the ball
        state.ball.direction.y += (state.player1.direction.y / 2);
        // normalise the ball speed
        let mag = Math.sqrt(state.ball.direction.x ** 2 + state.ball.direction.y ** 2);
        state.ball.direction.x = state.ball.direction.x / mag * Pong.BALL_SPEED;
        state.ball.direction.y = state.ball.direction.y / mag * Pong.BALL_SPEED;
      }
      state.changed = true;
    }
  }

  if (state.ball.position.x + halfsquare > state.player2.position.x - halfsquare &&
      state.ball.position.x + halfsquare < state.player2.position.x)
  {
    if ((state.ball.position.y - halfsquare < state.player2.position.y + halfbat &&
        state.ball.position.y - halfsquare > state.player2.position.y - halfbat) ||
        (state.ball.position.y + halfsquare < state.player2.position.y + halfbat &&
        state.ball.position.y + halfsquare > state.player2.position.y - halfbat))
    {
      state.ball.position.x = state.player2.position.x - Pong.SQUARE_SIZE;
      state.ball.direction.x = -state.ball.direction.x;
      // change the direction of the ball if the bat is moving
      if (state.player2.direction.y != 0)
      {
        // add half the bat speed to the ball
        state.ball.direction.y += (state.player2.direction.y / 2);
        // normalise the ball speed
        let mag = Math.sqrt(state.ball.direction.x ** 2 + state.ball.direction.y ** 2);
        state.ball.direction.x = state.ball.direction.x / mag * Pong.BALL_SPEED;
        state.ball.direction.y = state.ball.direction.y / mag * Pong.BALL_SPEED;
      }
      state.changed = true;
    }
  }
}

export function winner(state: GameState)
: string
{
  if (state.ball.position.x < state.player1.position.x - (Pong.SQUARE_SIZE * 3))
    return Team.player2;
  if (state.ball.position.x > state.player2.position.x + (Pong.SQUARE_SIZE * 3))
    return Team.player1;
  return '';
}
