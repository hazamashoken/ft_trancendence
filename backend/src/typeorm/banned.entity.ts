import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChannelsEntity } from './channel.entity';
import { User } from './user.entity';

@Entity('banned')
export class BannedEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'ban_id' })
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'banned_user' })
  bannedUser: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'banned_by' })
  bannedBy: User;

  @Column({ default: 'U desrve this ban', name: 'ban_reason' })
  banReason: string;

  @ManyToOne(() => ChannelsEntity, channel => channel.bannedUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'banned_at' })
  bannedAt: ChannelsEntity;
}
