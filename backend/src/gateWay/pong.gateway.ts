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

import { MatchsService } from '@backend/features/matchs/matchs.service';
import { Team } from '@backend/pong/pong.enum';

// export const _gameInstance: PongGame = new PongGame();

@UseGuards(SocketAuthGuard)
@WebSocketGateway({
  namespace: 'game',
  cors: true,
})
export class PongGateway {
  constructor(
    @Inject(forwardRef(() => UserSessionService))
    private readonly usService: UserSessionService,
    @Inject(forwardRef(() => MatchsService))
    private readonly matchService: MatchsService,
  ) {}

  @WebSocketServer()
  public server: Server = new Server<
    PongServerToClientEvents,
    PongClientToServerEvents
  >();
  private readonly _gameInstance = new PongGame(this.matchService);
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

    // this.logger.log('connect: ' + id + ', ' + name);

    const match = await this.matchService.findMatchsByUser(session.user.id);
    let channel = 'public_channel';

    if (match.length > 0) {
      let team: string = Team.viewer;
      if (match[0].player1.id == session.user.id) team = Team.player1;
      else team = Team.player2;
      channel = match[0].matchId.toString();
      this._gameInstance.addUser(this.server, id, name, channel, team);
    } else this._gameInstance.addUser(this.server, id, name, channel);
    client.join(channel);
    startGameLoop(this._gameInstance.update);
  }

  async handleDisconnect(client: Socket) {
    const id: string = this.getClientID(client);

    // this.logger.log('disconnect: ' + id);
    //client.leave('public channel');
    this._gameInstance.deleteUserByID(id);
    if (this._gameInstance.empty()) stopGameLoop();
  }

  getGameInstance() {
    return this._gameInstance;
  }

  @SubscribeMessage('pong_keypress')
  async handleReceiveKeypress(
    @ConnectedSocket() client: any,
    @MessageBody() payload: GameInstruction,
  ): Promise<void> {
    const id: string = this.getClientID(client);

    // this.logger.log('keypress: ' + payload.keypress);
    this._gameInstance.keypress(id, payload.keypress);
  }
}
