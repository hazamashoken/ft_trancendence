import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export type matchStatus = 'WAITING' | 'PLAYING' | 'FINISHED'

@Entity({ name: 'matchs' })
export class Match {

  @PrimaryGeneratedColumn({ name: 'match_id'})
  matchId: number;
  
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'player1_id' })
  player1: User;
  
  @RelationId((match: Match) => match.player1)
  player1Id: number;
  
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'player2_id' })
  player2: User;

  @RelationId((match: Match) => match.player2)
  player2Id: number;

  @Column({ name: 'player1_point', default: 0 })
  player1Point: number;

  @Column({ name: 'player2_point', default: 0 })
  player2Point: number;

  @Column({ name: 'match_date', default: new Date() })
  createAt: Date;

  @Column({
    type: 'enum',
    enum: ['WAITING', 'PLAYING', 'FINISHED'],
    default: 'WAITING'
  })
  status: matchStatus;
}
