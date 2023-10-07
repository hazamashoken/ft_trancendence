import { BannedEntity } from './banned.entity';
import { ChannelsEntity } from './channel.entity';
import { Friends } from './friends.entity';
import { MessagesEntity } from './messages.entity';
import { MutedEntity } from './muted.entity';
import { User } from './user.entity';

const entities = [
  User,
  Friends,
  ChannelsEntity,
  BannedEntity,
  MessagesEntity,
  MutedEntity,
];

export {
  User,
  Friends,
  ChannelsEntity,
  BannedEntity,
  MessagesEntity,
  MutedEntity,
};
export default entities;
