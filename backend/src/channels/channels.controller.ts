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
  UseGuards,
  Query,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
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
import { XKeyGuard } from '@backend/shared/x-key.guard';
import { AuthGuard } from '@backend/shared/auth.guard';
import { SocketGateway } from '@backend/gateWay/chat.gateway';
import { AuthUser } from '@backend/pipe/auth-user.decorator';
import { AuthUser as AuthUserInterface } from '@backend/interfaces/auth-user.interface';
import { PaginationDto } from '@backend/messages/dto/pagination.dto';

@Controller('channels')
// @UseGuards(XKeyGuard, AuthGuard)
// @ApiSecurity('x-api-key')
@ApiTags('Channels')
export class ChannelsController {
  constructor(
    private readonly channelsService: ChannelsService,
    @InjectRepository(User)
    @InjectRepository(BannedEntity)
    @InjectRepository(MutedEntity)
    private readonly mutedService: MutedService,
    private readonly bannedService: BannedService,
    private readonly messageService: MessagesService,
    private readonly chatGateway: SocketGateway,
  ) {}

  @Get('all')
  async findAll(): Promise<ChannelsEntity[]> {
    return this.channelsService.findAll();
  }

  @Get(':userId/all')
  async findUserChats(@Param('userId') userId: number): Promise<ChannelsEntity[]> {
    return this.channelsService.findAllUserChannels(userId);
  }


  @Post(':chatId/invite/:userName')
  async invite(@Param('userName') userName: string, @Param('chatId') chatId: number): Promise<ChatUserDto[]>
  {
    return await this.channelsService.inviteUserToChat(userName, chatId);
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

  @Get(':chatId/owner')
  async owner(@Param('chatId') chatId: number): Promise<ChatUserDto> {
    const owner = await this.channelsService.getOwnerById(chatId);
    if (!owner) throw new NotFoundException('UserNotFound');
    return owner;
  }

  @Post('create')
  async create(@Body() dto: ChannelCreatedTO): Promise<ChannelsEntity> {
    this.chatGateway.sendEvents('chat created');
    return this.channelsService.create(dto);
  }

  @Post(':chatId/delete/:userId')
  async deleteChat(
    @Param('chatId') chatId: number,
    @Param('userId') userId: number,
  ): Promise<ChannelsEntity[]> {
    this.chatGateway.sendEvents({messge: 'chat deleted', chatId: chatId});
    return await this.channelsService.delete(chatId, userId);
  }

  @Post(':chatId/update')
  async update(
    @Param('chatId') chatId: number,
    @Body() dto: UpdateChannelDto,
  ): Promise<ChannelsEntity> {
    this.chatGateway.sendEvents({event: 'chat updated', chatId: chatId});
    return this.channelsService.update(chatId, dto);
  }

  @Post(':chatId/addUser/:userId')
  async addUser(
    @Param('chatId') chatId: number,
    @Param('userId') userId: number,
  ): Promise<ChatUserDto[]> {
    try {
      this.chatGateway.sendEvents({message: 'user added', chatId: chatId, event: 'getChatUsers'});
      return await this.channelsService.addUserToChat(chatId, userId);
    } catch (error) {
      throw new NotFoundException(error.message, 'Not Found');
    }
  }

  @Post(':chatId/addUser')
  async addUserByName(
    @Param('chatId') chatId: number,
    @Body() dto: {userNmae: string},
  ): Promise<ChatUserDto[]> {
    try {
      this.chatGateway.sendEvents({message: 'user added', chatId: chatId, event: 'getChatUsers'});
      return await this.channelsService.addUserToChatByName(chatId, dto.userNmae);
    } catch (error) {
      throw new NotFoundException(error.message, 'Not Found');
    }
  }

  @Post(':chatId/removeUser/:userId',)
  async removeUser(
    @Param('chatId') chatId: number,
    @Param('userId') userId: number,
  ): Promise<ChatUserDto[] | null> {
    this.chatGateway.sendEvents({message: 'user removed', chatId: chatId, event: 'getChatUsers'});
    return await this.channelsService.removeUserFromChat(chatId, userId);
  }

  @Get(':chatId/users')
  async getUsers(@Param('chatId') chatId: number): Promise<ChatUserDto[]> {
    try {
      return await this.channelsService.findAllUsers(chatId);
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
      this.chatGateway.sendEvents({message: 'admin added', chatId: chatId, event: 'getChatAdmins'});
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
      this.chatGateway.sendEvents({message: 'admin removed', chatId: chatId, event: 'getChatAdmins'});
      return await this.channelsService.removeAdminFromChat(chatId, adminId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Get(':chatId/admins')
  async getAdmins(
    @Param('chatId') chatId: number,
  ): Promise<ChatUserDto[] | null> {
    try {
      return await this.channelsService.findAllAdmins(chatId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new Error('An error occurred while getting admins the user');
    }
  }

  @Get(':chatId/bannedUsers')
  async getBanned(@Param('chatId') chatId: number): Promise<ReturnBannedDto[]> {
    return await this.bannedService.findAllBannedUsersInChat(chatId);
  }

  @Post(':chatId/banUser/:adminId')
  async addBannedUserToChat(
    @Param('chatId') chatId: number,
    @Param('adminId') adminId: number,
    @Body() dto: BanUserDto,
  ): Promise<ReturnBannedDto[]> {
    this.chatGateway.sendEvents({message: 'user banned', chatId: chatId, event: 'getChatBanned'});
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
    this.chatGateway.sendEvents({message: 'user unbanned', chatId: chatId, event: 'getChatBanned'});
    return await this.bannedService.removeBannedById(bannedId, chatId);
  }

  @Post(':messageId/updateMessage')
  async updateMessage(
    @Body() dto: UpdateMessageDto,
  ): Promise<ReturnMessageDto> {
    this.chatGateway.sendEvents({message: 'mesagre updated', event: 'getChatMessages'});
    return await this.messageService.updateMessage(dto.messageId, dto.message);
  }

  @Post(':chatId/createmessage')
  async createMessage(
    @Param('chatId') chatId: number,
    @Body() dto: CreateMessageDto,
  ): Promise<ReturnMessageDto> {
    // return await this.channelsService.createMessage
    this.chatGateway.sendEvents({message: 'mesagre created', chatId: chatId, event: 'getChatMessages'});
    return await this.messageService.createMessage(
      chatId,
      dto.message,
      dto.userId,
    );
  }

  @Post(':chatId/deleteMessage/:messageId')
  async deleteMessage(
    @Param('messageId') messageId: number,
    @Param('chatId') chatId: number,
    @Query() pagination: PaginationDto,
  ): Promise<ReturnMessageDto[]> {
    this.chatGateway.sendEvents({message: 'mesagre deleted', chatId: chatId, event: 'getChatMessages'});
    return await this.messageService.deleteMessage(messageId, chatId, pagination);
  }


  @Get(':chatId/messages')
  async chatMessages(
    @Param('chatId') chatId: number,
    @Query()  paginationDto: PaginationDto,
  ): Promise<ReturnMessageDto[]> {
    return await this.messageService.findAllMessagesByChannel(chatId, paginationDto);
  }

  @Get(':chatId/muted')
  async findAllMutedAtChat(
    @Param('chatId') chatId: number,
  ): Promise<ReturnMutedDto[]> {
    return await this.channelsService.getMute(chatId);
  }

  @Post('/muteUser')
  async muteuUser(@Body() dto: CreateMuteDto): Promise<ReturnMutedDto[]> {
    this.chatGateway.sendEvents({message: 'user muted', event: 'getChatMuted'});
    return await this.channelsService.muteUser(
      dto.userId,
      dto.channelId,
      dto.mutedById,
      dto.mutedUntil,
    );
  }

  @Post(':chatId/muteUpdate')
  async updateMute(
    @Param('chatId') chatId: number,
    @Body() dto: UpdateMuteDto,
  ): Promise<ReturnMutedDto[]> {
    this.chatGateway.sendEvents({message: 'user muted', event: 'getChatMuted'});
    return await this.channelsService.muteUpdated(
      dto.muteId,
      chatId,
      dto.mutedUntil,
    );
  }

  @Post(':chatId/unmute/:mutedId')
  async unMute(
    @Param('mutedId') mutedId: number,
    @Param('chatId') chatId: number,
  ): Promise<ReturnMutedDto[]> {
    this.chatGateway.sendEvents({message: 'mute update', event: 'getChatMuted'});
    return await this.channelsService.unMute(mutedId, chatId);
  }

  @Post(':chatId/joinChat/:userId')
  async join(
    @Param('chatId') chatId: number,
    @Param('userId') userId: number,
  ): Promise<ChatUserDto[]> {
    this.chatGateway.sendEvents({message: 'user joinchat', event: 'getActiveUsers'});
    return await this.channelsService.joinChannel(chatId, userId);
  }

  @Post(':chatId/quitChat/:userId')
  async quit(
    @Param('chatId') chatId: number,
    @Param('userId') userId: number,
  ): Promise<ChatUserDto[]> {
    this.chatGateway.sendEvents({message: 'user quitChat', event: 'getActiveUsers'});
    return await this.channelsService.quitChannel(chatId, userId);
  }

  @Get(':chatId/activeUsers')
  async active(@Param('chatId') chatId: number): Promise<ChatUserDto[]> {
    return await this.channelsService.getActiveUsers(chatId);
  }

//   @Get('channels/:chatId/pwd')
//   async getPwd(@Param('chatId') chatId: number): Promise<string> {
//     return await this.channelsService.getPassword(chatId);
//   }
// }
}
