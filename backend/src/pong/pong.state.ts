import { GameBall, GameState } from '../interfaces/pong.interface';
import { Pong, Phase, Team, Keypress } from './pong.enum';
import { collision, winner } from './pong.collision';
import { newGameState } from './pong.gamestate';

const WIN_SCORE: number = 3;
const RESTART_DELAY: number = 10000;

export class PongState
{
  _state: GameState;  // the game state
  _locked: boolean;   // stop updates to game state when locked
  _single: boolean;   // 1 game or repeating game
  _countdown: number; // countdown timer

  public constructor()
  {
    this._state = newGameState();
    this._locked = false;
    this._single = false;
    this._countdown = 0;
  }

  public state()
  : GameState
  {
    return this._state;
  }

  public get phase()
  : string
  {
    return this._state.phase;
  }

  public set phase(phase: string)
  {
    this._state.phase = phase;
    this._state.changed = true;
  }

  public get changed()
  : boolean
  {
    return this._state.changed;
  }

  public set changed(changed: boolean)
  {
    this._state.changed = changed;
  }

  public get locked()
  : boolean
  {
    return this._locked;
  }

  public set locked(locked: boolean)
  {
    this._locked = locked;
  }

  public get single()
  : boolean
  {
    return this._single;
  }

  public set single(single: boolean)
  {
    this._single = single;
  }

  public hideBall()
  {
    this._state.ball.position.x = 0;
    this._state.ball.position.y = 0.5;
    this._state.ball.direction.x = 0;
    this._state.ball.direction.y = 0;
    this._state.ball.visible = false;
    this._state.multiball = [];
    this._state.changed = true;
  }

  public serveBall()
  {
    let angle: number = Math.random() * (Math.PI / 4);

    this._state.ball.position.x = this._state.serve * 0.2;
    this._state.ball.position.y = 0.5;
    this._state.ball.direction.x = this._state.serve * Math.cos(angle) * Pong.BALL_SPEED;
    this._state.ball.direction.y = -this._state.serve * Math.sin(angle) * Pong.BALL_SPEED;
    this._state.ball.visible = true;
    this._state.serve = -this._state.serve;
    this._state.changed = true;
  }

  public serveMultiBall(team: string)
  {
    let angle: number = Math.random() * (Math.PI / 4);
    let serve: number = 1;
    let ball: GameBall = {
      position: { x: 0, y: 0.5, },
      direction: { x: 0, y: 0, },
      visible: true,
    };

    if (team == Team.player1)
    {
      if (this._state.player1.multiballs > 0)
        this._state.player1.multiballs--;
      else
        return ;
    }
    else if (team == Team.player2)
    {
      if (this._state.player2.multiballs > 0)
        this._state.player2.multiballs--;
      else
        return ;
      serve = -1;
    }
    else
      return ;

    ball.position.x = serve * 0.2;
    ball.position.y = 0.5;
    ball.direction.x = serve * Math.cos(angle) * Pong.BALL_SPEED;
    ball.direction.y = serve * Math.sin(angle) * Pong.BALL_SPEED;
    this._state.multiball.push(ball);
    this._state.changed = true;
  }

  public usePowerup(team: string)
  {
    if (team == Team.player1 && this._state.player1.powerups > 0)
    {
      this._state.player1.powerup = true;
      this._state.player1.powerups--;
      this._state.changed = true;
    }
    if (team == Team.player2 && this._state.player2.powerups > 0)
    {
      this._state.player2.powerup = true;
      this._state.player2.powerups--;
      this._state.changed = true;
    }
  }

  public incrementScore(team: string)
  {
    if (team == Team.player1)
      this._state.player1.score++;
    else if (team == Team.player2)
      this._state.player2.score++;
    this._state.changed = true;
  }

  public getDirection(team: string)
  : string
  {
    let direction: number = 0;

    if (team == Team.player1)
      direction = this._state.player1.direction.y;
    else if (team == Team.player2)
      direction = this._state.player2.direction.y;

    if (direction == -1)
      return Keypress.up;
    else if (direction == 1)
      return Keypress.down;

    return Keypress.release;
  }

  public setDirection(team: string, keypress: string)
  {
    if (team == Team.player1)
    {
      if (keypress == Keypress.up)
        this._state.player1.direction.y = -1;
      else if (keypress == Keypress.down)
        this._state.player1.direction.y = 1;
      else if (keypress == Keypress.release)
        this._state.player1.direction.y = 0;
    }
    else if (team == Team.player2)
    {
      if (keypress == Keypress.up)
        this._state.player2.direction.y = -1;
      else if (keypress == Keypress.down)
        this._state.player2.direction.y = 1;
      else if (keypress == Keypress.release)
        this._state.player2.direction.y = 0;
    }
    this._state.changed = true;
  }

  public update(delta: number)
  {
    if (this.locked)
      return ;

    collision(this._state, delta);

    if (this.phase == Phase.finish)
    {
      if (this.single || !this._state.continue)
        return ;
      this._countdown -= delta;
      if (this._countdown > 0)
        return ;
      this._state = newGameState();
      this.phase = Phase.ready;
      return ;
    }

    let team: string = winner(this._state);
    if (team == Team.player1 || team == Team.player2)
    {
      this.phase = Phase.ready;
      this.incrementScore(team);
      if (this._state.player1.score >= WIN_SCORE || this._state.player2.score >= WIN_SCORE)
      {
        this.phase = Phase.finish;
        this._countdown = RESTART_DELAY;
      }
      this.hideBall();
    }
  }
}
