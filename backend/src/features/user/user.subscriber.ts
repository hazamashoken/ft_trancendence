import { User } from '@backend/typeorm';
import {
  DataSource,
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';
import { StatsService } from '../stats/stats.service';
import { POINT_DEFAULT, Stats } from '@backend/typeorm/stats.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> { // eslint-disable-line prettier/prettier
  constructor(
    public dataSource: DataSource,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async afterInsert(event: InsertEvent<any>) {
    console.log(`AFTER ENTITY INSERTED:`, event.entity);
    await this.createNewStat(event)
  }

  createNewStat(event: InsertEvent<any>) {
    const stats = new Stats();
    const user = new User();
    user.id = event.entity.id;
    stats.user = user;
    stats.win = 0;
    stats.lose = 0;
    stats.point = POINT_DEFAULT;
    stats.matchs = 0;
    stats.winRate = '0.00';
    return event.manager.getRepository(Stats).save(stats);
  }
}
