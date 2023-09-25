import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChannelsEntity } from './channel.entity';
import { User } from '@backend/typeorm/user.entity';

@Entity('muted')
export class MutedEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'mute_id' })
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'muted_user' })
  user: User;

  @ManyToOne(() => ChannelsEntity, (channel) => channel.mutedUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'muted_at' })
  mutedAt: ChannelsEntity;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'banned_by' })
  mutedBy: User;

  @Column({ type: 'timestamp', default: () => 'now()', name: 'muted_until' })
  mutedUntill: Date;
}
