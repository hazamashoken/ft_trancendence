import { FtUser } from '@backend/interfaces/ft-user.interface';
import {
  Entity,
  PrimaryColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type UserSessionStatusType = 'ONLINE' | 'IN_GAME' | 'OFFLINE';

@Entity({ name: 'user_session' })
export class UserSession {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @Column({
    type: 'enum',
    enum: ['ONLINE', 'IN_GAME', 'OFFLINE'],
    default: 'OFFLINE',
  })
  status: UserSessionStatusType;

  @Column({ name: 'access_token', nullable: true })
  @Index()
  accessToken: string;

  @Column({ name: 'expired_token_timestamp', type: 'bigint', nullable: true })
  expiredTokenTimestamp: number;

  @Column({ type: 'simple-json', name: 'ft_user', nullable: true })
  ftUser: FtUser;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
