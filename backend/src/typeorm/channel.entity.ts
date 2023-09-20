import { BaseEntity, Column, JoinColumn,CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, BeforeInsert, AfterInsert } from 'typeorm';
import { MessagesEntity } from './messages.entity';
import { MutedEntity } from './muted.entity';
import { BannedEntity } from './banned.entity';
import { User } from '@backend/typeorm/user.entity';
// import { Logger } from '@nestjs/common';

export enum ChannelType {
	PUBLIC = 'public',
	PROTECTED = 'protected',
	PRIVATE = 'private',
	DIRECT = 'direct'
  }

@Entity('chats')
export class ChannelsEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	chat_id: number;

	@ManyToOne(() => User)
	chanel_owner: User;


	@ManyToMany(() => User)
	@JoinTable({name: 'chat_admins'})
	chat_admins: User[];

	@Column({nullable: true, default: null})
	chat_name: string;

	@ManyToMany(() => User)
	@JoinTable({name: 'chat_users'})
	chat_users: User[];

	@ManyToMany(() => User)
	@JoinTable({name: 'active_users'})
	active_users: User[];

	@Column({
		type: 'enum',
		enum: ChannelType,
		default: ChannelType.PUBLIC
	})
	chanel_type: ChannelType;

	@Column({nullable: true, default: null})
	max_users: number;

	@OneToMany(() => MessagesEntity, message => message.channel)
	chanel_messages: MessagesEntity[];

	@OneToMany(() => BannedEntity, (banned) => banned.banned_at, { cascade: true })
	@JoinTable()
	banned_users: BannedEntity[];

	@OneToMany(() => MutedEntity, muted => muted.muted_at)
	@JoinTable()
	muted_users: MutedEntity[];

	@Column({ nullable: true, default: null})
	password: string;

	@Column({type: 'timestamp', default: () => 'now()'})
	creating_date: Date;

	@BeforeInsert()
	setDefaultChatName() {
		if (!this.chat_name) {
			this.chat_name = `${this.chanel_type} ${this.chanel_owner.firstName} chat`;
		  }
	}

}