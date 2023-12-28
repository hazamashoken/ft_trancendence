import { Entity, Column, PrimaryGeneratedColumn, OneToOne, RelationId, JoinColumn, Unique, } from 'typeorm';
import { User } from './user.entity';

export const POINT_DEFAULT: number = 1000;
@Entity({ name: 'user_stats' })
@Unique([ "user" ])
export class Stats {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
  
  @Column({ default: 0 })
  win: number;

  @Column({ default: 0 })
  lose: number;

  @Column({ default: 0 })
  matchs: number;

  @Column({ name: 'win_rate' })
  winRate: string;

  @Column({ default: POINT_DEFAULT })
  point: number;
}
