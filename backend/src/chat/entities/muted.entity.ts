import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChannelsEntity } from './channel.entity';
import { User } from '@backend/typeorm/user.entity';

@Entity('muted')
export class MutedEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(()=> User)
	user: User;

	@ManyToOne(() => ChannelsEntity, channel => channel.muted_users, {
		onDelete: 'CASCADE',
	  })
	muted_at: ChannelsEntity;

	@ManyToOne(()=> User)
	muted_by: User;

	@Column({type: 'timestamp', default: () => 'now()'})
	muted_until: Date;
}