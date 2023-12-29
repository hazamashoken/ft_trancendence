import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  RelationId,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

export const POINT_DEFAULT = 1000;
@Entity({ name: 'user_stats' })
@Unique(['user'])
export class Stats {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @OneToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ApiProperty()
  @Column({ default: 0 })
  win: number;

  @ApiProperty()
  @Column({ default: 0 })
  lose: number;

  @ApiProperty()
  @Column({ default: 0 })
  matchs: number;

  @ApiProperty()
  @Column({ name: 'win_rate' })
  winRate: string;

  @ApiProperty()
  @Column({ default: POINT_DEFAULT })
  point: number;
}
