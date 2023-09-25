import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents, GameState } from '@/lib/pong.interface';
import { newGameState } from './pong.gamestate';

const _socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3000');

let _state: GameState = newGameState();

_socket.on('pong_state', (e) => {
  _state = e;
});

export function getSocket()
: Socket
{
  return _socket;
}

export function getGameState()
: GameState
{
  return _state;
}
