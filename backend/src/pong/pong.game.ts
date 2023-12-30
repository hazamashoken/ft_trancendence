import { Server } from 'socket.io';
import { PongUser } from './pong.user';
import { PongState } from './pong.state';
import { GameState } from '../interfaces/pong.interface';
import { Phase, Keypress, Team } from './pong.enum';
import { newGameState } from './pong.gamestate';
import { ClientRequest } from 'http';

export class PongGame {
  _server: Server;
  _users: Map<string, PongUser>;
  _states: Map<string, PongState>;

  public constructor() {
    this._users = new Map<string, PongUser>();
    this._states = new Map<string, PongState>();
  }

  public addUser(
    server: Server,
    id: string,
    name: string,
    room: string,
    team: string = Team.viewer,
  ) {
    this._server = server;
    // send a disconnect message to old websocket if duplicate connection
    for (const user of this._users.values()) {
      if (user.name == name) {
        const state: GameState = newGameState();
        state.phase = Phase.disconnect;
        this._server.to(user.id).emit('pong_state', state);
        this.deleteUserByID(user.id);
      }
    }
    // create the user
    this._users.set(id, new PongUser(id, name, room));
    // create the room if it doesn't exist
    if (!this._states.has(room)) this._states.set(room, new PongState());
    this._states.get(room).room = room;
    // if a team is selected simulate the keypress to choose the team
    if (team == Team.player1) {
      this._states.get(room).player1 = name;
      this.keypress(id, Keypress.player1);
    } else if (team == Team.player2) {
      this._states.get(room).player2 = name;
      this.keypress(id, Keypress.player2);
    } else if (team == Team.spectator)
      this._users.get(id).team = Team.spectator;

    console.log(`User ${name} joined room ${room}`);
  }

  public deleteUserByID(id: string) {
    if (this._users.has(id)) {
      // get the room of the user
      const room: string = this._users.get(id).room;
      // delete the user
      this._users.delete(id);
      // delete the room if it is empty
      for (const user of this._users.values()) {
        if (user.room == room) return;
      }
      this._states.delete(room);
    }
  }

  public deleteUserByName(name: string) {
    const id = this.findUserIDByName(name);
    if (id != null) this.deleteUserByID(id);
  }

  public moveUserByID(id: string, room: string, team: string = Team.viewer) {
    if (this._users.has(id)) {
      const name: string = this._users.get(id).name;
      const oldRoom: string = this._users.get(id).room;
      this._server.in(id).socketsLeave(oldRoom);
      this.deleteUserByID(id);
      this.addUser(this._server, id, name, room, team);
      this._states.get(room).single = true;
      this._server.in(id).socketsJoin(room);
    }
  }

  public moveUserByName(
    name: string,
    room: string,
    team: string = Team.viewer,
  ) {
    const id = this.findUserIDByName(name);
    if (id != null) this.moveUserByID(id, room, team);
  }

  public findUserIDByName(name: string): string {
    for (const user of this._users.values()) {
      if (user.name == name) return user.id;
    }
    return null;
  }

  public setRoomPlayers(room: string, p1name: string, p2name: string) {
    const id1: string = this.findUserIDByName(p1name);
    const id2: string = this.findUserIDByName(p2name);

    if (id1 != null && id2 != null) {
      this._users.get(id1).team = Team.player1;
      this._users.get(id2).team = Team.player2;
      const state = this._states.get(room).state();
      state.phase = Phase.ready;
      this.sendState(room);
    }
  }

  public empty(): boolean {
    if (this._states.size == 0) return true;
    return false;
  }

  public sendState(room: string) {
    const state: GameState = this._states.get(room).state();

    this._server.to(room).emit('pong_state', state);
    //console.log(state);
  }

  public readonly update = (delta: number) => {
    this.update2(delta);
  };

  update2(delta: number) {
    for (const [room, state] of this._states.entries()) {
      if (!state.locked) {
        state.update(delta);
        if (state.changed) {
          state.changed = false;
          this.sendState(room);
        }
      }
    }
  }

  hasTeamMember(room: string, team: string): boolean {
    for (const user of this._users.values()) {
      if (user.room == room && user.team == team) return true;
    }
    return false;
  }

  countKeypress(room: string, team: string, keypress: string): number {
    let count = 0;

    for (const user of this._users.values()) {
      if (user.room == room && user.team == team && user.keypress == keypress)
        count++;
    }
    return count;
  }

  public keypress(id: string, keypress: string) {
    const user: PongUser = this._users.get(id);
    const state: PongState = this._states.get(user.room);

    // if a spectator ignore key press
    if (user.team == Team.spectator || state.phase == Phase.disconnect) {
      return;
    }

    // lock the game state
    state.locked = true;

    // change the user keypress state
    user.keypress = keypress;

    // user requests a state refresh
    if (keypress == Keypress.refresh) {
      state.changed = true;
    }

    // if user selects a team
    if (keypress == Keypress.player1 && user.team == Team.viewer) {
      user.team = Team.player1;
      if (state.phase == Phase.waiting) state.phase = Phase.readyP1;
      else if (state.phase == Phase.readyP2) state.phase = Phase.ready;
      state.changed = true;
    } else if (keypress == Keypress.player2 && user.team == Team.viewer) {
      user.team = Team.player2;
      if (state.phase == Phase.waiting) state.phase = Phase.readyP2;
      else if (state.phase == Phase.readyP1) state.phase = Phase.ready;
      state.changed = true;
    }

    // if user serves a multiball
    if (
      (keypress == Keypress.start || keypress == Keypress.classic) &&
      state.phase == Phase.play &&
      user.team != Team.viewer
    ) {
      state.serveMultiBall(user.team);
    }

    // if user uses a powerup
    if (keypress == Keypress.super && user.team != Team.viewer) {
      state.usePowerup(user.team);
    }

    // if user clicks start game
    if (
      (keypress == Keypress.start || keypress == Keypress.classic) &&
      user.team != Team.viewer &&
      state.phase == Phase.ready
    ) {
      // remove powerups for classic
      if (keypress == Keypress.classic) {
        state.disableMultiball();
        state.disablePowerup();
      }
      // if both teams have joined play can start
      if (
        (user.team == Team.player1 &&
          this.hasTeamMember(user.room, Team.player2)) ||
        (user.team == Team.player2 &&
          this.hasTeamMember(user.room, Team.player1))
      ) {
        state.serveBall();
        state.phase = Phase.play;
      }
    }

    // recalculate the direction
    if (
      keypress == Keypress.up ||
      keypress == Keypress.down ||
      keypress == Keypress.release
    ) {
      const keyCountU: number = this.countKeypress(
        user.room,
        user.team,
        Keypress.up,
      );
      const keyCountD: number = this.countKeypress(
        user.room,
        user.team,
        Keypress.down,
      );
      const direction: string = state.getDirection(user.team);

      // only update direction if it changes
      if (keyCountU > keyCountD && direction != Keypress.up)
        state.setDirection(user.team, Keypress.up);
      else if (keyCountU < keyCountD && direction != Keypress.down)
        state.setDirection(user.team, Keypress.down);
      else if (direction != Keypress.release)
        state.setDirection(user.team, Keypress.release);
    }

    // send an update if needed
    if (state.changed) {
      state.changed = false;
      this.sendState(user.room);
    }

    // unlock the game state
    state.locked = false;
  }
}
