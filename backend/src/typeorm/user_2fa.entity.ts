import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_2fa' })
export class User2fa {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @Column({ type: 'enum', enum: ['MOBILE', 'ANY'], default: 'ANY' })
  device: User2faDevice;

  @Column()
  secret: string;

  @Column({ type: 'enum', enum: ['ACTIVE', 'INACTIVE'], default: 'INACTIVE' })
  status: User2faStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export type User2faDevice = 'MOBILE' | 'ANY';
export type User2faStatus = 'ACTIVE' | 'INACTIVE';
