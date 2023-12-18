import { BannedEntity } from './banned.entity';
import { ChannelsEntity } from './channel.entity';
import { Friendship } from './friendship.entity';
import { MessagesEntity } from './messages.entity';
import { MutedEntity } from './muted.entity';
import { User } from './user.entity';
import { User2fa } from './user_2fa.entity';

const entities = [
  User,
  Friendship,
  User2fa,
  ChannelsEntity,
  BannedEntity,
  MessagesEntity,
  MutedEntity,
];

export {
  User,
  Friendship,
  User2fa,
  ChannelsEntity,
  BannedEntity,
  MessagesEntity,
  MutedEntity,
};
export default entities;
