import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

export type MatchStatus = 'WAITING' | 'STARTING' | 'PLAYING' | 'FINISHED';

@Entity({ name: 'matchs' })
export class Match {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'match_id' })
  matchId: number;

  @ApiProperty()
  @ManyToOne(() => User, user => user)
  @JoinColumn({ name: 'player1_id' })
  player1: User;

  @ApiProperty()
  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'player2_id' })
  player2: User;

  @ApiProperty()
  @Column({ name: 'player1_point', default: 0 })
  player1Point: number;

  @ApiProperty()
  @Column({ name: 'player2_point', default: 0 })
  player2Point: number;

  @ApiProperty()
  @Column({ name: 'match_date', default: new Date() })
  createAt: Date;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: ['WAITING', 'PLAYING', 'FINISHED', 'STARTING'],
    default: 'WAITING',
  })
  status: MatchStatus;
}
