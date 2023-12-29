import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { ChannelsEntity } from './channel.entity';
import { User } from '@backend/typeorm/user.entity';

@Entity('messages')
export class MessagesEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'message_id' })
  messageId: number;

  @ManyToOne(() => ChannelsEntity, channel => channel.chatMessages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chat_id' })
  channel: ChannelsEntity;

  @Column()
  message: string;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ type: 'timestamp', default: () => 'now()', name: 'create_at' })
  createAt: Date;

  @Column({ type: 'timestamp', default: null, name: 'update_at' })
  updateAt: Date;
}
