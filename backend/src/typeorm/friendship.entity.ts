import {
  Entity,
  Unique,
  Column,
  ManyToOne,
  RelationId,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('friendship')
@Unique(['user', 'friend'])
export class Friendship {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @ManyToOne(() => User, user => user.id)
  friend: User;

  @RelationId((friend: Friendship) => friend.friend)
  friendId: number;

  @Column({
    type: 'enum',
    enum: ['REQUESTED', 'ACCEPTED'],
    default: 'REQUESTED',
  })
  status: FriendshipStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export type FriendshipStatus = 'REQUESTED' | 'ACCEPTED';
