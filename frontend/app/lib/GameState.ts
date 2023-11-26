import { io, Socket } from 'socket.io-client';
import { PongServerToClientEvents, PongClientToServerEvents, GameState } from '../../../backend/src/interfaces/pong.interface';
import { newGameState } from '../../../backend/src/pong/pong.gamestate';

const _socket: Socket<PongServerToClientEvents, PongClientToServerEvents> = io('http://localhost:3000');

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
