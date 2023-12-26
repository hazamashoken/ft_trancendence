import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import {
  PongServerToClientEvents,
  PongClientToServerEvents,
  GameInstruction,
} from '../interfaces/pong.interface';
import { Server } from 'socket.io';
import { PongGame } from '../pong/pong.game';
import { startGameLoop, stopGameLoop } from '../pong/pong.gameloop';

let _game: PongGame = new PongGame();

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PongGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  public server: Server = new Server<
    PongServerToClientEvents,
    PongClientToServerEvents
  >();
  private logger = new Logger('PongGateway');

  getClientID(@ConnectedSocket() client: any)
  {
    return `${client.id}`;
  }

  handleConnection(@ConnectedSocket() client: any)
  {
    var id: string = this.getClientID(client);
  
    this.logger.log('connect: ' + id);
    _game.addUser(this.server, id, id, 'community_pong');
    client.join('community_pong');
    startGameLoop(_game.update);
  }

  handleDisconnect(@ConnectedSocket() client: any)
  {
    var id: string = this.getClientID(client);
  
    this.logger.log('disconnect: ' + id);
    client.leave('community_pong');
    _game.deleteUser(id);
    if (_game.empty())
      stopGameLoop();
  }

  @SubscribeMessage('pong_keypress')
  async handleReceiveKeypress(@ConnectedSocket() client: any, @MessageBody() payload: GameInstruction)
    : Promise<void>
  {
    var id: string = this.getClientID(client);

    this.logger.log('keypress: ' + payload.keypress);
    _game.keypress(id, payload.keypress);
  }
}
