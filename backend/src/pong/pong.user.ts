import { GameUser } from '../interfaces/pong.interface';
import { Team } from './pong.enum';

export class PongUser {
  _user: GameUser;

  public constructor(id: string, name: string, room: string) {
    this._user = {
      id: id,
      name: name,
      room: room,
      team: Team.viewer,
      keypress: '',
    };
  }

  public user(): GameUser {
    return this._user;
  }

  public get id(): string {
    return this._user.id;
  }

  public set id(id: string) {
    this._user.id = id;
  }

  public get name(): string {
    return this._user.name;
  }

  public set name(name: string) {
    this._user.name = name;
  }

  public get room(): string {
    return this._user.room;
  }

  public set room(room: string) {
    this._user.room = room;
  }

  public get team(): string {
    return this._user.team;
  }

  public set team(team: string) {
    this._user.team = team;
  }

  public get keypress(): string {
    return this._user.keypress;
  }

  public set keypress(keypress: string) {
    this._user.keypress = keypress;
  }
}
