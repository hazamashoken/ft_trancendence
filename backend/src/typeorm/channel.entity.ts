import {
  BaseEntity,
  Column,
  JoinColumn,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  BeforeInsert,
  AfterInsert,
} from 'typeorm';
import { MessagesEntity } from './messages.entity';
import { MutedEntity } from './muted.entity';
import { BannedEntity } from './banned.entity';
import { User } from '@backend/typeorm/user.entity';
import { Exclude } from 'class-transformer';

export enum chatType {
  PUBLIC = 'public',
  PROTECTED = 'protected',
  PRIVATE = 'private',
  DIRECT = 'direct',
}

@Entity('chats')
export class ChannelsEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'chat_id' })
  chatId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'chat_owner' })
  chatOwner: User;

  @ManyToMany(() => User)
  @JoinTable({ name: 'chat_admins' })
  @JoinColumn({ name: 'chat_admins' })
  @Exclude()
  chatAdmins: User[];

  @Column({ nullable: true, default: null, name: 'chat_name' })
  chatName: string;

  @ManyToMany(() => User)
  @JoinTable({ name: 'chat_users' })
  @JoinColumn({ name: 'chat_users' })
  // @Exclude()
  chatUsers: User[];

  @ManyToMany(() => User)
  @JoinTable({ name: 'active_users' })
  @JoinColumn({ name: 'active_users' })
  @Exclude()
  activeUsers: User[];

  @Column({
    type: 'enum',
    enum: chatType,
    default: chatType.PUBLIC,
    name: 'chat_type',
  })
  chatType: chatType;

  @Column({ nullable: true, default: null })
  @JoinColumn({ name: 'max_users' })
  maxUsers: number;

  @OneToMany(() => MessagesEntity, message => message.channel, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @Exclude()
  chatMessages: MessagesEntity[];

  @OneToMany(() => BannedEntity, banned => banned.bannedAt, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'banned' })
  @JoinColumn({ name: 'banned_users' })
  @Exclude()
  bannedUsers: BannedEntity[];

  @OneToMany(() => MutedEntity, muted => muted.mutedAt, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'muted' })
  @JoinColumn({ name: 'muted_users' })
  @Exclude()
  mutedUsers: MutedEntity[];

  @Column({ nullable: true, default: null })
  @Exclude()
  password: string;

  @Column({ type: 'timestamp', default: () => 'now()', name: 'creating_date' })
  creatingDate: Date;

  @BeforeInsert()
  setDefaultChatName() {
    if (this.chatName == null) {
      this.chatName = `${this.chatType} ${this.chatOwner.firstName} chat`;
    }
  }
}
