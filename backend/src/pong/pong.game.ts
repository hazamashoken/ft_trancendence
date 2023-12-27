import { Server } from 'socket.io';
import { PongUser } from './pong.user';
import { PongState } from './pong.state';
import { GameState } from '../interfaces/pong.interface';
import { Phase, Keypress, Team } from './pong.enum';
import { newGameState } from './pong.gamestate';

export class PongGame
{
  _server: Server;
  _users: Map<string, PongUser>;
  _states: Map<string, PongState>;

  public constructor()
  {
    this._users = new Map<string, PongUser>();
    this._states = new Map<string, PongState>();
  }

  public addUser(server: Server, id: string, name: string, room: string, team: string = Team.viewer)
  {
    this._server = server;
    // create the user
    this._users.set(id, new PongUser(id, name, room));
    // create the room if it doesn't exist
    if (!this._states.has(room))
      this._states.set(room, new PongState())
    // if a team is selected simulate the keypress to choose the team
    if (team == Team.player1)
      this.keypress(id, Keypress.player1);
    else if (team == Team.player2)
      this.keypress(id, Keypress.player2);
    else if (team == Team.spectator)
      this._users.get(id).team = Team.spectator;
  }

  public deleteUser(id: string)
  {
    if (this._users.has(id))
    {
      // get the room of the user
      let room: string = this._users.get(id).room;
      // delete the user
      this._users.delete(id);
      // delete the room if it is empty
      for (let user of this._users.values())
      {
        if (user.room == room)
          return;
      }
      this._states.delete(room);
    }
  }

  public moveUser(id: string, room: string, team: string = Team.viewer)
  {
    if (this._users.has(id))
    {
      let name: string = this._users.get(id).name;
      // send a disconnect message to old room
      let state: GameState = newGameState();
      state.phase = Phase.disconnect;
      this._server.to(id).emit('pong_state', state);
      this.deleteUser(id);
      this.addUser(this._server, id, name, room, team);
    }
  }

  public empty()
  : boolean
  {
    if (this._states.size == 0)
      return true;
    return false;
  }

  public sendState(room: string)
  {
    let state: GameState = this._states.get(room).state();

    this._server.to(room).emit('pong_state', state);
    //console.log(state);
  }

  public readonly update = (delta: number) => {
    this.update2(delta);
  }

  update2(delta: number)
  {
    for (let [room, state] of this._states.entries())
    {
      if (!state.locked)
      {
        state.update(delta);
        if (state.changed)
        {
          state.changed = false;
          this.sendState(room);
        }
      }
    }
  }

  hasTeamMember(room: string, team: string)
  : boolean
  {
    for (let user of this._users.values())
    {
      if (user.room == room && user.team == team)
        return true;
    }
    return false;
  }

  countKeypress(room: string, team:string, keypress: string)
  : number
  {
    let count: number = 0;

    for (let user of this._users.values())
    {
      if (user.room == room && user.team == team && user.keypress == keypress)
        count++;
    }
    return count;
  }

  public keypress(id: string, keypress: string)
  {
    let user: PongUser = this._users.get(id);
    let state: PongState = this._states.get(user.room);

    // if a spectator ignore key press
    if (user.team == Team.spectator || state.phase == Phase.disconnect)
    {
      return;
    }

    // lock the game state
    state.locked = true;

    // change the user keypress state
    user.keypress = keypress;
  
    // user requests a state refresh
    if (keypress == Keypress.refresh)
    {
      state.changed = true;
    }

    // if user selects a team
    if (keypress == Keypress.player1 && user.team == Team.viewer)
    {
      user.team = Team.player1;
      if (state.phase == Phase.waiting)
        state.phase = Phase.readyP1;
      else if (state.phase == Phase.readyP2)
        state.phase = Phase.ready;
      state.changed = true;
    }
    else if (keypress == Keypress.player2 && user.team == Team.viewer)
    {
      user.team = Team.player2;
      if (state.phase == Phase.waiting)
        state.phase = Phase.readyP2;
      else if (state.phase == Phase.readyP1)
        state.phase = Phase.ready;
      state.changed = true;
    }

    // if user serves a multiball
    if (keypress == Keypress.start && state.phase == Phase.play && user.team != Team.viewer)
    {
      state.serveMultiBall(user.team);
    }

    // if user uses a powerup
    if (keypress == Keypress.super && user.team != Team.viewer)
    {
      state.usePowerup(user.team);
    }

    // if user clicks start game
    if (keypress == Keypress.start && user.team != Team.viewer &&
        state.phase == Phase.ready)
    {
      // if both teams have joined play can start
      if (user.team == Team.player1 && this.hasTeamMember(user.room, Team.player2) ||
          user.team == Team.player2 && this.hasTeamMember(user.room, Team.player1))
      {
        state.serveBall();
        state.phase = Phase.play;
      }
    }

    // recalculate the direction
    if (keypress == Keypress.up || keypress == Keypress.down || keypress == Keypress.release)
    {
      let keyCountU: number = this.countKeypress(user.room, user.team, Keypress.up);
      let keyCountD: number = this.countKeypress(user.room, user.team, Keypress.down);
      let direction: string = state.getDirection(user.team);

      // only update direction if it changes
      if (keyCountU > keyCountD && direction != Keypress.up)
        state.setDirection(user.team, Keypress.up);
      else if (keyCountU < keyCountD && direction != Keypress.down)
        state.setDirection(user.team, Keypress.down);
      else if (direction != Keypress.release)
        state.setDirection(user.team, Keypress.release);
    }

    // send an update if needed
    if (state.changed)
    {
      state.changed = false;
      this.sendState(user.room);
    }

    // unlock the game state
    state.locked = false;
  }
}
