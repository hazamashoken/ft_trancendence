import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import {
  Controller,
  Inject,
  Logger,
  UseGuards,
  forwardRef,
} from '@nestjs/common';
import {
  PongServerToClientEvents,
  PongClientToServerEvents,
  GameInstruction,
} from '../interfaces/pong.interface';
import { Server, Socket } from 'socket.io';
import { PongGame } from '../pong/pong.game';
import { startGameLoop, stopGameLoop } from '../pong/pong.gameloop';
import { AuthGuard } from '@backend/shared/auth.guard';
import { XKeyGuard } from '@backend/shared/x-key.guard';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@backend/pipe/auth-user.decorator';
import { AuthUser as AuthUserInterface } from '@backend/interfaces/auth-user.interface';
import { UserSessionService } from '@backend/features/user-session/user-session.service';
import { SocketAuthMiddleware } from '@backend/shared/socket-auth.middleware';
import { SocketAuthGuard } from '@backend/shared/socket-auth.guard';

export const _gameInstance: PongGame = new PongGame();

@UseGuards(SocketAuthGuard)
@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: '*',
  },
})
export class PongGateway {
  constructor(private readonly usService: UserSessionService) {}
  @WebSocketServer()
  public server: Server = new Server<
    PongServerToClientEvents,
    PongClientToServerEvents
  >();
  private logger = new Logger('PongGateway');

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any);
  }

  getClientID(@ConnectedSocket() client: Socket) {
    return `${client.id}`;
  }

  async handleConnection(client: Socket) {
    if (!client.handshake.auth.accessToken) {
      client.disconnect();
    }
    const session = await this.usService.getSessionByToken(
      client.handshake.auth.accessToken,
    );
    if (!session) {
      console.error('Session Expired');
      client.disconnect();
      return;
    }
    const id: string = this.getClientID(client);
    const name: string = session.user.intraLogin;

    this.logger.log('connect: ' + id + ', ' + name);
    _gameInstance.addUser(this.server, id, name, 'public channel');
    client.join('public channel');
    startGameLoop(_gameInstance.update);
  }

  async handleDisconnect(client: Socket) {
    const id: string = this.getClientID(client);

    this.logger.log('disconnect: ' + id);
    //client.leave('public channel');
    _gameInstance.deleteUserByID(id);
    if (_gameInstance.empty()) stopGameLoop();
  }

  @SubscribeMessage('pong_keypress')
  async handleReceiveKeypress(
    @ConnectedSocket() client: any,
    @MessageBody() payload: GameInstruction,
  ): Promise<void> {
    const id: string = this.getClientID(client);

    this.logger.log('keypress: ' + payload.keypress);
    _gameInstance.keypress(id, payload.keypress);
  }
}
