import { BannedEntity } from './banned.entity';
import { ChannelsEntity } from './channel.entity';
import { MessagesEntity } from './messages.entity';
import { MutedEntity } from './muted.entity';
import { User } from './user.entity';

const entities = [User, ChannelsEntity, BannedEntity, MessagesEntity, MutedEntity];

export { User };
export default entities;
