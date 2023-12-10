export enum ChatType {
  PUBLIC = 'public',
  PROTECTED = 'protected',
  PRIVATE = 'private',
  DIRECT = 'direct',
}

export interface User {
  id: number;
  intraId: number;
  intraLogin: string;
  intraUrl: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChannelsEntity {
  chatId: number;
  chatOwner: User;
  chatName: string;
  chatType: ChatType;
  maxUsers: number;
  creatingDate: Date;
}

export interface ChatUserDto {
  id: number;
  intraId: number;
  firstName: string;
}

export interface ChannelCreatedTO {
  chatName: string;
  chatOwner: number;
  password: string;
  maxUsers: number;
  chatType: ChatType;
}

export interface ReturnBannedDto {
  id: number;
  bannedUser: User;
  bannedBy: string;
  banReason: string;
  bannedAt: string;
}

export interface UpdateMessageDto {
  messageId: number;
  message: string;
}

export interface ReturnMessageDto {
  massageId: number;
  message: string;
  athor: User;
  my: string;
  hm: string;
}

export interface CreateMessageDto {
  message: string;
  userId: number;
}

export interface ReturnMutedDto {
  id: number;
  user: User;
  mutedAt: ChannelsEntity;
  mutedBy: User;
  mutedUntil: Date;
}


export interface CreateMuteDto {
  userId: number;
  channelId: number;
  mutedById: number;
  mutedUntil?: Date | null;
}

export interface UpdateMuteDto {
  muteId: number;
  mutedUntil?: Date | null;
}

export interface ReturnMutedDto {
  id: number;
  user: User;
  mutedAt: ChannelsEntity;
  mutedBy: User;
  mutedUntil: Date;
}

export interface BanUserDto {
  bannedUser: number;
  banReason: string;
}
