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

@WebSocketGateway({
  namespace: 'sessions',
  cors: { origin: '*' },
})
export class SessionGateway {
  constructor(private usSubscriber: UserSessionSubscriber) {}
  @WebSocketServer() server: Server;
  private subscriptions = new Subscription();

  afterInit(server: Server) {
    console.log('AfterInit:', server);
    const timer$ = timer(0, 1000)
      .pipe(
        tap(() => this.listOnlineUsers()),
        tap(() => this.listIngameUsers()),
      )
      .subscribe();
    this.subscriptions.add(timer$);
  }

  handleConnection(client: Socket) {
    console.log('Connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Disconnected:', client.id);
  }

  listOnlineUsers() {
    const event = 'listOnlineUsers';
    this.usSubscriber.getOnlineUsers().subscribe(users => {
      this.server.emit(event, { users });
    });
  }

  listIngameUsers() {
    const event = 'listIngameUsers';
    this.usSubscriber.getIngameUsers().subscribe(users => {
      this.server.emit(event, { users });
    });
  }

  @SubscribeMessage('events')
  onEvent(@MessageBody() data: string): Observable<WsResponse<number>> {
    const event = 'events';
    const response = [1, 2, 3];
    return from(response).pipe(map(data => ({ event, data })));
  }
}
