import { ChannelsEntity } from '@backend/chat/entities/channel.entity';
import { User } from './user.entity';
import { BannedEntity } from '@backend/chat/entities/banned.entity';
import { MessagesEntity } from '@backend/chat/entities/messages.entity';
import { MutedEntity } from '@backend/chat/entities/muted.entity';

const entities = [User, ChannelsEntity, BannedEntity, MessagesEntity, MutedEntity];

export { User };
export default entities;
