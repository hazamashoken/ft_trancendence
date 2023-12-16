import { BannedEntity } from './banned.entity';
import { ChannelsEntity } from './channel.entity';
import { Friend } from './friend.entity';
import { MessagesEntity } from './messages.entity';
import { MutedEntity } from './muted.entity';
import { User } from './user.entity';
import { User2fa } from './user_2fa.entity';

const entities = [
  User,
  Friend,
  User2fa,
  ChannelsEntity,
  BannedEntity,
  MessagesEntity,
  MutedEntity,
];

export {
  User,
  Friend,
  User2fa,
  ChannelsEntity,
  BannedEntity,
  MessagesEntity,
  MutedEntity,
};
export default entities;
