import { UserSession } from '@backend/typeorm';
import {
  DataSource,
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { BehaviorSubject, Observable, Subject, from } from 'rxjs';
import { UserSessionStatusType } from '@backend/typeorm/user-session.entity';
import { UserSessionService } from './user-session.service';
import { ResponseUtil } from '@backend/utils/response.util';
@EventSubscriber()
export class UserSessionSubscriber
  implements EntitySubscriberInterface<UserSession>
{
  // eslint-disable-line prettier/prettier
  constructor(
    public dataSource: DataSource,
    private usService: UserSessionService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return UserSession;
  }

  async afterInsert(event: InsertEvent<any>) {
    console.log(`AFTER ENTITY INSERTED:`, event.entity);
    this.usService.onlineUsers = await this.listDetail(event, 'ONLINE');
    this.usService.ingameUsers = await this.listDetail(event, 'IN_GAME');
  }

  async afterUpdate(event: UpdateEvent<any>) {
    console.log(`AFTER ENTITY INSERTED:`, event.entity);
    this.usService.onlineUsers = await this.listDetail(event, 'ONLINE');
    this.usService.ingameUsers = await this.listDetail(event, 'IN_GAME');
  }

  listDetail(
    event: UpdateEvent<any> | InsertEvent<any>,
    status?: UserSessionStatusType,
  ): Promise<Partial<UserSession>[]> {
    const query = event.manager.getRepository(UserSession).find({
      relations: { user: true },
      select: {
        id: true,
        status: true,
      },
      where: {
        status,
      },
      order: {
        status: 'ASC',
      },
    });
    return query;
  }
}
