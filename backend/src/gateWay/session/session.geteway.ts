import { UseGuards, UseInterceptors } from '@nestjs/common';
import { UserSessionSubscriber } from './../../features/user-session/user-session.subscriber';
import { UserSessionService } from '@backend/features/user-session/user-session.service';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Observable, Subscription, from, map, tap, timer } from 'rxjs';
import { Socket } from 'socket.io';
import { SocketAuthGuard } from '@backend/shared/socket-auth.guard';
import { SocketAuthMiddleware } from '@backend/shared/socket-auth.middleware';
import { UserSession } from '@backend/typeorm';

@UseGuards(SocketAuthGuard)
@WebSocketGateway({
  namespace: 'sessions',
  cors: { origin: '*' },
})
export class SessionGateway {
  constructor(private usService: UserSessionService) {}
  @WebSocketServer() server: Server;
  private subscriptions = new Subscription();

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any)
    const timer$ = timer(0, 1000)
      .pipe(
        tap(() => this.listOnlineUsers()),
        tap(() => this.listIngameUsers()),
      )
      .subscribe();
    this.subscriptions.add(timer$);
  }

  async handleConnection(client: Socket) {
    if (!client.handshake.auth.accessToken) {
      client.disconnect();
    }
    const session = await this.usService.getSessionByToken(client.handshake.auth.accessToken);
    if (!session) {
      console.error('Session Expired');
      client.disconnect();
    } else {
      console.log(`Connect ${client.id}:`, session.id);
      await this.usService.repository.update({ id: session.id }, { status: 'ONLINE'})
    }
  }

  async handleDisconnect(client: Socket) {
    const session = await this.usService.getSessionByToken(client.handshake.auth.accessToken);
    if (session && session.id) {
      console.log(`Disconnect ${client.id}:`, session.id);
      await this.usService.repository.update({ id: session.id }, { status: 'OFFLINE'})
    }
  }

  listOnlineUsers() {
    const event = 'listOnlineUsers';
    this.usService.onlineUsers.subscribe(users => {
      this.server.emit(event, { users, total: users.length });
    });
  }

  listIngameUsers() {
    const event = 'listIngameUsers';
    this.usService.ingameUsers.subscribe(users => {
      this.server.emit(event, { users, total: users.length });
    });
  }

  @SubscribeMessage('events')
  onEvent(@MessageBody() data: string): Observable<WsResponse<number>> {
    const event = 'events';
    const response = [1, 2, 3];
    return from(response).pipe(map(data => ({ event, data })));
  }
}
