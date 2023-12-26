import { GameState } from '@/lib/pong.interface';
import { Pong, Team } from '@/lib/pong.enum';

export function collision(state: GameState, delta: number)
{
  let halfsquare: number = Pong.SQUARE_SIZE / 2;
  let halfbat: number = Pong.SQUARE_SIZE * Pong.BAT_SIZE / 2;
  let seconds: number = delta / 1000;
  let i: number = 0;

  // move bat and ball
  state.player1.position.y += (seconds * Pong.BAT_SPEED * state.player1.direction.y);
  state.player2.position.y += (seconds * Pong.BAT_SPEED * state.player2.direction.y);
  state.ball.position.x += (seconds * Pong.BALL_SPEED * state.ball.direction.x);
  state.ball.position.y += (seconds * Pong.BALL_SPEED * state.ball.direction.y);

  // move multiballs
  for (i = 0; i < state.multiball.length; i++)
  {
    state.multiball[i].position.x += (seconds * Pong.BALL_SPEED * state.multiball[i].direction.x);
    state.multiball[i].position.y += (seconds * Pong.BALL_SPEED * state.multiball[i].direction.y);
  }

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

  // multiball with wall collision
  for (i = 0; i < state.multiball.length; i++)
  {
    if (state.multiball[i].position.y < halfsquare)
    {
      state.multiball[i].position.y = halfsquare;
      state.multiball[i].direction.y = -state.multiball[i].direction.y;
      state.changed = true;
    }
    else if (state.multiball[i].position.y > 1 - halfsquare)
    {
      state.multiball[i].position.y = 1 - halfsquare;
      state.multiball[i].direction.y = -state.multiball[i].direction.y;
      state.changed = true;
    }
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
      if (state.player1.powerup)
      {
        state.ball.direction.x *= 2;
        state.ball.direction.y *= 2;
        state.player1.powerup = false;
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
      if (state.player2.powerup)
      {
        state.ball.direction.x *= 2;
        state.ball.direction.y *= 2;
        state.player2.powerup = false;
      }
      state.changed = true;
    }
  }

  // multiball with bat collision
  for (i = 0; i < state.multiball.length; i++)
  {
    if (state.multiball[i].position.x - halfsquare < state.player1.position.x + halfsquare &&
      state.multiball[i].position.x - halfsquare > state.player1.position.x)
    {
      if ((state.multiball[i].position.y - halfsquare < state.player1.position.y + halfbat &&
          state.multiball[i].position.y - halfsquare > state.player1.position.y - halfbat) ||
          (state.multiball[i].position.y + halfsquare < state.player1.position.y + halfbat &&
          state.multiball[i].position.y + halfsquare > state.player1.position.y - halfbat))
      {
        state.multiball[i].position.x = state.player1.position.x + Pong.SQUARE_SIZE;
        state.multiball[i].direction.x = -state.multiball[i].direction.x;
        // change the direction of the ball if the bat is moving
        if (state.player1.direction.y != 0)
        {
          // add half the bat speed to the ball
          state.multiball[i].direction.y += (state.player1.direction.y / 2);
          // normalise the ball speed
          let mag = Math.sqrt(state.multiball[i].direction.x ** 2 + state.multiball[i].direction.y ** 2);
          state.multiball[i].direction.x = state.multiball[i].direction.x / mag * Pong.BALL_SPEED;
          state.multiball[i].direction.y = state.multiball[i].direction.y / mag * Pong.BALL_SPEED;
        }
        if (state.player1.powerup)
        {
          state.multiball[i].direction.x *= 2;
          state.multiball[i].direction.y *= 2;
          state.player1.powerup = false;
        }
        state.changed = true;
      }
    }

    if (state.multiball[i].position.x + halfsquare > state.player2.position.x - halfsquare &&
        state.multiball[i].position.x + halfsquare < state.player2.position.x)
    {
      if ((state.multiball[i].position.y - halfsquare < state.player2.position.y + halfbat &&
          state.multiball[i].position.y - halfsquare > state.player2.position.y - halfbat) ||
          (state.multiball[i].position.y + halfsquare < state.player2.position.y + halfbat &&
          state.multiball[i].position.y + halfsquare > state.player2.position.y - halfbat))
      {
        state.multiball[i].position.x = state.player2.position.x - Pong.SQUARE_SIZE;
        state.multiball[i].direction.x = -state.multiball[i].direction.x;
        // change the direction of the ball if the bat is moving
        if (state.player2.direction.y != 0)
        {
          // add half the bat speed to the ball
          state.multiball[i].direction.y += (state.player2.direction.y / 2);
          // normalise the ball speed
          let mag = Math.sqrt(state.multiball[i].direction.x ** 2 + state.multiball[i].direction.y ** 2);
          state.multiball[i].direction.x = state.multiball[i].direction.x / mag * Pong.BALL_SPEED;
          state.multiball[i].direction.y = state.multiball[i].direction.y / mag * Pong.BALL_SPEED;
        }
        if (state.player2.powerup)
        {
          state.multiball[i].direction.x *= 2;
          state.multiball[i].direction.y *= 2;
          state.player2.powerup = false;
        }
        state.changed = true;
      }
    }
  }
}

export function winner(state: GameState)
: string
{
  let square3: number = Pong.SQUARE_SIZE * 3;
  let i: number = 0;

  if (state.ball.position.x < state.player1.position.x - square3)
    return Team.player2;
  if (state.ball.position.x > state.player2.position.x + square3)
    return Team.player1;

  for (i = 0; i < state.multiball.length; i++)
  {
    if (state.multiball[i].position.x < state.player1.position.x - square3)
      return Team.player2;
    if (state.multiball[i].position.x > state.player2.position.x + square3)
      return Team.player1;
  }

  return '';
}
