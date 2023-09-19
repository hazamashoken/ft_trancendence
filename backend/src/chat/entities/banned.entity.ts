import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChannelsEntity } from "./channel.entity";
import { User } from "@backend/typeorm/user.entity";
// import { User } from "src/user/entities/user.entity";

@Entity('banned')
export class BannedEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinTable({ name: 'user_id' })
  banned_user: User;

  @ManyToOne(() => User)
  @JoinTable({ name: 'banned_by_user_id' })
  banned_by: User;

  @Column({default: 'U desrve this ban'})
  ban_reason: string;

  @ManyToOne(() => ChannelsEntity, (channel) => channel.banned_users, {
    onDelete: 'CASCADE',
  })
  banned_at: ChannelsEntity;
}