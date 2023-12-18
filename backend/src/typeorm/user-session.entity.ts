import {
  Entity,
  PrimaryColumn,
  Column,
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
  accessToken: string;

  @Column({ name: 'expired_token_timestamp', type: 'bigint', nullable: true })
  expiredTokenTimestamp: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
