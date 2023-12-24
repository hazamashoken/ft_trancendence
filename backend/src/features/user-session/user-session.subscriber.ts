import { UserSession } from '@backend/typeorm';
import {
  DataSource,
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { UserSessionStatusType } from '@backend/typeorm/user-session.entity';
@EventSubscriber()
export class UserSessionSubscriber implements EntitySubscriberInterface<UserSession> { // eslint-disable-line prettier/prettier
  constructor(public dataSource: DataSource) {
    dataSource.subscribers.push(this);
    this.listDetail('ONLINE').subscribe(users => this.onlineUsers.next(users));
    this.listDetail('IN_GAME').subscribe(users => this.ingameUsers.next(users));
  }

  private onlineUsers = new BehaviorSubject<Partial<UserSession>[]>([]);
  private ingameUsers = new BehaviorSubject<Partial<UserSession>[]>([]);

  getOnlineUsers() {
    return this.onlineUsers.asObservable();
  }

  getIngameUsers() {
    return this.ingameUsers.asObservable();
  }

  listenTo() {
    return UserSession;
  }

  afterInsert(event: InsertEvent<any>) {
    console.log(`AFTER ENTITY INSERTED:`, event.entity);
    if (event.entity.status === 'ONLINE') {
      this.listDetail('ONLINE').subscribe(users => this.onlineUsers.next(users));
    }
    if (event.entity.status === 'IN_GAME') {
      this.listDetail('IN_GAME').subscribe(users => this.onlineUsers.next(users));
    }
  }

  async afterUpdate(event: UpdateEvent<any>) {
    console.log(`AFTER ENTITY UPDATED:`, event.entity);
    this.listDetail().subscribe(users => this.onlineUsers.next(users));
  }

  listDetail(
    status?: UserSessionStatusType,
  ): Observable<Partial<UserSession>[]> {
    const query = this.dataSource.getRepository(UserSession).find({
      relations: { user: true },
      select: {
        id: true,
        status: true,
      },
      where: {
        status: status,
      },
      order: {
        status: 'ASC',
      },
    });
    return from(query);
  }
}
