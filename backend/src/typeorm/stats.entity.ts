import { Entity, Column, PrimaryGeneratedColumn, OneToOne, RelationId, JoinColumn, Unique, } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_stats' })
@Unique([ "user" ])
export class Stats {

  @PrimaryGeneratedColumn()
  id: number;

  // @OneToOne(() => User, (user) => user.id)
  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
  user: User;
  
  // @RelationId((state: Stats) => state.user)
  // userId: number;

  @Column({ default: 0 })
  win: number;

  @Column({ default: 0 })
  lose: number;

  @Column({ default: 0 })
  matchs: number;

  @Column({ name: 'win_rate' })
  winRate: string;

  @Column({ default: 1000 })
  point: number;
}
