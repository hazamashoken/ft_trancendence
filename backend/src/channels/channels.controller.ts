import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BannedEntity,
  ChannelsEntity,
  MessagesEntity,
  MutedEntity,
  User,
} from '@backend/typeorm';
import { ReturnChanelDto } from './dto/return-cnannel.dto';
import { ChannelCreatedTO } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ChatUserDto } from './dto/chat-user.dto';
import { BanUserDto } from '@backend/banned/dto/ban-user.dto';
import { ReturnMessageDto } from '@backend/messages/dto/return-message.dto';
import { UpdateMessageDto } from '@backend/messages/dto/update-message.dto';
import { CreateMessageDto } from '@backend/messages/dto/create-message.dto';
import { ReturnMutedDto } from '@backend/muted/dto/return-muted.dto';
import { MutedService } from '@backend/muted/muted.service';
import { BannedService } from '@backend/banned/banned.service';
import { MessagesService } from '@backend/messages/messages.service';
import { ReturnBannedDto } from '@backend/banned/dto/return-ban.dto';
import { CreateMuteDto } from '@backend/muted/dto/create-muted.dto';
import { UpdateMuteDto } from '@backend/muted/dto/update-mute.dto';
// import { BannedDto } from '../dto/banned.dto';
// import { MessagesEntity } from '../entities/messages.entity';
// import { createMessageDto, returnMessageDto } from '../dto/messages.dto';
// import { returnUserDto } from '../dto/userChannels.dto';

@Controller('channels')
@ApiTags('channels')
export class ChannelsController {
  constructor(
    private readonly channelsService: ChannelsService,
    @InjectRepository(User)
    @InjectRepository(BannedEntity)
    @InjectRepository(MutedEntity)
    private readonly mutedService: MutedService,
    private readonly bannedService: BannedService,
    private readonly messageService: MessagesService,
  ) {}

  @Get('all')
  async findAll(): Promise<ChannelsEntity[]> {
    return this.channelsService.findAll();
  }

  @Get('public')
  async findPublic(): Promise<ChannelsEntity[]> {
    return this.channelsService.findAllPublicChannels();
  }

  @Get('usersPrivate/:userId')
  async findPrivate(
    @Param('userId') userId: number,
  ): Promise<ChannelsEntity[]> {
    return this.channelsService.findUserPrivateChats(userId);
  }

  @Get('usersProtect/:userId')
  async findPotected(
    @Param('userId') userId: number,
  ): Promise<ChannelsEntity[]> {
    return this.channelsService.findUserProtectedChats(userId);
  }

  @Get('usersDm/:userId')
  async findDm(@Param('userId') userId: number): Promise<ChannelsEntity[]> {
    return this.channelsService.findUserDmChats(userId);
  }

  @Get(':chatId')
  async findOne(@Param('chatId') chatId: number): Promise<ChannelsEntity> {
    return this.channelsService.findOneById(chatId);
  }

  @Get('owner/:chatId')
  async owner(@Param('chatId') chatId: number): Promise<ChatUserDto> {
    const owner = await this.channelsService.getOwnerById(chatId);
    if (!owner) throw new NotFoundException('UserNotFound');
    return owner;
  }

  @Post('create')
  async create(@Body() dto: ChannelCreatedTO): Promise<ChannelsEntity> {
    return this.channelsService.create(dto);
  }

  @Post('delete/:chatId/:userId')
  async deleteChat(
    @Param('chatId') chatId: number,
    @Param('userId') userId: number,
  ): Promise<ChannelsEntity[]> {
    return await this.channelsService.delete(chatId, userId);
  }

  @Post('update/:chatId')
  async update(
    @Param('chatId') chatId: number,
    @Body() dto: UpdateChannelDto,
  ): Promise<ChannelsEntity> {
    return this.channelsService.update(chatId, dto);
  }

  @Post(':chatId/addUser/:userId')
  async addUser(
    @Param('chatId') chatId: number,
    @Param('userId') userId: number,
  ): Promise<ChatUserDto[]> {
    try {
      return await this.channelsService.addUserToChat(chatId, userId);
    } catch (error) {
      throw new NotFoundException(error.message, 'Not Found');
    }
  }

  @Post(':chatId/removeUser/:userId')
  async removeUser(
    @Param('chatId') chatId: number,
    @Param('userId') userId: number,
  ): Promise<ChatUserDto[] | null> {
    return await this.channelsService.removeUserFromChat(chatId, userId);
  }

  @Get('users/:id')
  async getUsers(@Param('id') id: number): Promise<ChatUserDto[]> {
    try {
      return await this.channelsService.findAllUsers(id);
    } catch (error) {
      throw new NotFoundException(error.message, 'Not Found');
    }
  }

  @Post(':chatId/addAdmin/:userId')
  async addAdmin(
    @Param('chatId') chatId: number,
    @Param('userId') userId: number,
  ): Promise<ChatUserDto[]> {
    try {
      return await this.channelsService.addAdminToChat(chatId, userId);
    } catch (error) {
      throw new NotFoundException(error.message, 'Not Found');
    }
  }

  @Post(':chatId/removeAdmin/:adminId')
  async removeAdmin(
    @Param('chatId') chatId: number,
    @Param('adminId') adminId: number,
  ): Promise<ChatUserDto[] | null> {
    try {
      return await this.channelsService.removeAdminFromChat(chatId, adminId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Get('admins/:chatId')
  async getAdmins(
    @Param('chatId') chatId: number,
  ): Promise<ChatUserDto[] | null> {
    try {
      return await this.channelsService.findAllAdmins(chatId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new Error('An error occurred while banning the user');
    }
  }

  @Get('bannedUsers/:chatId')
  async getBanned(@Param('chatId') chatId: number): Promise<ReturnBannedDto[]> {
    return await this.bannedService.findAllBannedUsersInChat(chatId);
  }

  @Post(':chatId/banUser/:adminId')
  async addBannedUserToChat(
    @Param('chatId') chatId: number,
    @Param('adminId') adminId: number,
    @Body() dto: BanUserDto,
  ): Promise<ReturnBannedDto[]> {
    return await this.bannedService.createBanned(
      chatId,
      dto.bannedUser,
      adminId,
      dto.banReason,
    );
  }

  @Post(':chatId/removeBanned/:bannedId')
  async removeBanned(
    @Param('bannedId') bannedId: number,
    @Param('chatId') chatId: number,
  ): Promise<ReturnBannedDto[]> {
    return await this.bannedService.removeBannedById(bannedId, chatId);
  }

  @Post('channels/:messageId/updateMessage')
  async updateMessage(
    @Body() dto: UpdateMessageDto,
  ): Promise<ReturnMessageDto> {
    return await this.messageService.updateMessage(dto.messageId, dto.message);
  }

  @Post('channels/:chatId/createmessage')
  async createMessage(
    @Param('chatId') chatId: number,
    @Body() dto: CreateMessageDto,
  ): Promise<ReturnMessageDto> {
    // return await this.channelsService.createMessage
    return await this.messageService.createMessage(
      chatId,
      dto.message,
      dto.userId,
    );
  }

  @Post('channels/:chatId/deleteMessage/:messageId')
  async deleteMessage(
    @Param('messageId') messageId: number,
    @Param('chatId') chatId: number,
  ): Promise<ReturnMessageDto[]> {
    return await this.messageService.deleteMessage(messageId, chatId);
  }
  @Get('channels/:chatId/messages')
  async chatMessages(
    @Param('chatId') chatId: number,
  ): Promise<ReturnMessageDto[]> {
    return await this.messageService.findAllMessagesByChannel(chatId);
  }

  @Get(':chatId/muted')
  async findAllMutedAtChat(
    @Param('chatId') chatId: number,
  ): Promise<ReturnMutedDto[]> {
    return await this.channelsService.getMute(chatId);
  }

  @Post('channels/:chatId/mute/:muteId')
  async muteuUser(@Body() dto: CreateMuteDto): Promise<ReturnMutedDto[]> {
    return await this.channelsService.muteUser(
      dto.userId,
      dto.channelId,
      dto.mutedById,
      dto.mutedUntil,
    );
  }

  @Post('muteUpdate/:chatId')
  async updateMute(
    @Param('chatId') chatId: number,
    @Body() dto: UpdateMuteDto,
  ): Promise<ReturnMutedDto[]> {
    return await this.channelsService.muteUpdated(
      dto.muteId,
      chatId,
      dto.mutedUntil,
    );
  }

  @Post('channels/:chatId/unmute/:mutedId')
  async unMute(
    @Param('mutedId') mutedId: number,
    @Param('chatId') chatId: number,
  ): Promise<ReturnMutedDto[]> {
    return await this.channelsService.unMute(mutedId, chatId);
  }

  @Post('channels/:chatId/joinChat/:userId')
  async join(
    @Param('chatId') chatId: number,
    @Param('userId') userId: number,
  ): Promise<ChatUserDto[]> {
    return await this.channelsService.joinChannel(chatId, userId);
  }

  @Post('channels/:chatId/quitChat/:userId')
  async quit(
    @Param('chatId') chatId: number,
    @Param('userId') userId: number,
  ): Promise<ChatUserDto[]> {
    return await this.channelsService.quitChannel(chatId, userId);
  }

  @Get('channels/:chatId/activeUsers')
  async active(@Param('chatId') chatId: number): Promise<ChatUserDto[]> {
    return await this.channelsService.getActiveUsers(chatId);
  }

  @Get('channels/:chatId/pwd')
  async getPwd(@Param('chatId') chatId: number): Promise<string> {
    return await this.channelsService.getPassword(chatId);
  }
}
