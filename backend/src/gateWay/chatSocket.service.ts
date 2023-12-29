import { CreateMuteDto } from '@backend/features/muted/dto/create-muted.dto';
import { ReturnMutedDto } from '@backend/features/muted/dto/return-muted.dto';
import { UpdateMuteDto } from '@backend/features/muted/dto/update-mute.dto';
import { AuthGuard } from '@backend/shared/auth.guard';
import { XKeyGuard } from '@backend/shared/x-key.guard';
import { ChannelsEntity } from '@backend/typeorm';
import { Inject, Injectable, UseGuards, forwardRef } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SocketGateway } from './chat.gateway';
import { ChannelsService } from '@backend/features/channels/channels.service';
import { MessagesService } from '@backend/features/messages/messages.service';
import { BannedService } from '@backend/features/banned/banned.service';

@Injectable()
@UseGuards(XKeyGuard, AuthGuard)
export class SocketService {

  private readonly connectedClients: Map<string, Socket> = new Map();
  constructor(
    private channelsService: ChannelsService,
    private bannedService: BannedService,
    private messageService: MessagesService,
    @Inject(forwardRef(() => SocketGateway))
    private chatGateway: SocketGateway,
  ) { }

  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    this.connectedClients.set(clientId, socket);

    socket.on('disconnect', () => {
      this.connectedClients.delete(clientId);
    });
  }

  handleMessage(message: string): string {
    console.log(`Message received: ${message}`);
    return `Message processed: ${message}`;
  }

  // async findAllChannels(): Promise<ChannelsEntity[]> {
  //   return await this.channelsService.findAll();
  // }

  // async findAllPublicChannels(): Promise<ChannelsEntity[]> {
  //   return await this.channelsService.findAllPublicChannels();
  // }

  // async findUserPrivateChats(userId: number): Promise<ChannelsEntity[]> {
  //   return await this.channelsService.findUserPrivateChats(userId);
  // }

  // async findUserProtectedChats(userId: number): Promise<ChannelsEntity[]> {
  //   return await this.channelsService.findUserProtectedChats(userId);
  // }

  // async findUserDmChats(userId: number): Promise<ChannelsEntity[]> {
  //   return await this.channelsService.findUserDmChats(userId);
  // }

  // async findChat(chatId: number): Promise<ChannelsEntity> {
  //   return await this.channelsService.findOneById(chatId);
  // }

  // async findChatOwner(chatId: number): Promise<ChatUserDto> {
  //   return await this.channelsService.getOwnerById(chatId);
  // }

  // async createChat(dto: ChannelCreatedTO): Promise<ChannelsEntity> {
  //   return await this.channelsService.create(dto);
  // }

  // async deleteChat(chatId: number, userId: number): Promise<ChannelsEntity[]> {
  //   return await this.channelsService.delete(chatId, userId);
  // }

  // async updateChat(chatId: number, data: UpdateChannelDto): Promise<ChannelsEntity> {
  //   return await this.channelsService.update(chatId, data);
  // }

  // async addUserToChat(chatId: number, userId: number): Promise<ChatUserDto[]> {
  //   return await this.channelsService.addUserToChat(chatId, userId);
  // }

  // async removeUserFromChat(chatId: number, userId: number): Promise<ChatUserDto[] | null> {
  //   return await this.channelsService.removeUserFromChat(chatId, userId);
  // }

  // async chatUsers(chatId: number): Promise<ChatUserDto[]> {
  //   return await this.channelsService.findAllUsers(chatId);
  // }

  // async addAdminToChat(chatId: number, userId: number,): Promise<ChatUserDto[]> {
  //   return await this.channelsService.addAdminToChat(chatId, userId);
  // }

  // async removeAdminFromChat(chatId: number, adminId: number): Promise<ChatUserDto[]> {
  //   return await this.channelsService.removeAdminFromChat(chatId, adminId);
  // }

  // async findChatAdmins(chatId: number): Promise<ChatUserDto[]> {
  //   return await this.channelsService.findAllAdmins(chatId);
  // }

  // async getBannedUsers(chatId: number): Promise<ReturnBannedDto[]> {
  //   return await this.bannedService.findAllBannedUsersInChat(chatId);
  // }

  // async addBannedUser(chatId: number, adminId: number, dto: BanUserDto): Promise<ReturnBannedDto[]> {
  //   return await this.bannedService.createBanned(chatId, dto.bannedUser, adminId, dto.banReason);
  // }

  // async removeBannedUser(chatId: number, bannedId: number): Promise<ReturnBannedDto[]> {
  //   return await this.bannedService.removeBannedById(bannedId, chatId);
  // }

  // async updateMessage(dto: UpdateMessageDto): Promise<ReturnMessageDto> {
  //   return await this.messageService.updateMessage(dto.messageId, dto.message);
  // }

  // async createMessage(chatId: number, dto: CreateMessageDto): Promise<ReturnMessageDto> {
  //   return await this.messageService.createMessage(chatId, dto.message, dto.userId);
  // }

  // async deleteMessage(messageId: number, chatId: number): Promise<ReturnMessageDto[]> {
  //   return await this.messageService.deleteMessage(messageId, chatId);
  // }

  // async findAllMessagesByChannel(chatId: number): Promise<ReturnMessageDto[]> {
  //   return await this.messageService.findAllMessagesByChannel(chatId);
  // }

  // async findAllMutedAtChat(chatId: number): Promise<ReturnMutedDto[]> {
  //   return await this.channelsService.getMute(chatId);
  // }

  // async muteUser(dto: CreateMuteDto): Promise<ReturnMutedDto[]> {
  //   return await this.channelsService.muteUser(dto.userId, , dto.mutedById, dto.mutedUntil);
  // }

  // async updateMute(dto: UpdateMuteDto, chatId: number): Promise<ReturnMutedDto[]> {
  //   return await this.channelsService.muteUpdated(dto.muteId, chatId, dto.mutedUntil);
  // }

  // async unMute(mutedId: number, chatId: number): Promise<ReturnMutedDto[]> {
  //   return await this.channelsService.unMute(mutedId, chatId);
  // }

  // async joinChannel(chatId: number, userId: number): Promise<ChatUserDto[]> {
  //   return this.channelsService.joinChannel(chatId, userId);
  // }

  // async quitChannel(chatId: number, userId: number): Promise<ChatUserDto[]> {
  //   return this.channelsService.quitChannel(chatId, userId);
  // }

  // async getActiveUsers(chatId: number): Promise<ChatUserDto[]> {
  //   return this.channelsService.getActiveUsers(chatId);
  // }

  // async getPassword(chatId: number): Promise<string> {
  //   return this.channelsService.getPassword(chatId);
  // }

  sendWebSocketMessage(event: any): void {
    this.chatGateway.sendEvents(event);
  }
}