import {
  Entity,
  ManyToOne,
  OneToMany,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('friends')
export class Friends {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @OneToMany(() => User, (user) => user.id)
  friends: User[];

  @Column({
    type: 'enum',
    enum: ['REQUESTED', 'ACCEPTED'],
    default: 'REQUESTED',
  })
  status: FriendStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export type FriendStatus = 'REQUESTED' | 'ACCEPTED';
