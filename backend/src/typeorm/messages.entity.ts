import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChannelsEntity } from "./channel.entity";
import { User } from "@backend/typeorm/user.entity";

@Entity('messages')
export class MessagesEntity extends BaseEntity{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => ChannelsEntity, (channel) => channel.chanel_messages, {onDelete: 'CASCADE'})
	channel: ChannelsEntity;

	@Column()
	message: string;

	@ManyToOne(() => User)
	author: User;

	@Column({type: 'timestamp', default: () => 'now()'})
  	create_at: Date;
}