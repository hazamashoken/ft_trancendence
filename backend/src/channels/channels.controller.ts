import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, Logger, HttpStatus } from '@nestjs/common';
// import { ChannelsEntity, ChannelType } from '../entities/channel.entity';
import { ChannelsService } from './channels.service';
import { ApiTags } from '@nestjs/swagger';
// import { ChannelDto } from '../dto/channels.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@backend/typeorm';
import { ReturnChanelDto } from './dto/return-cnannel.dto';
import { ChannelCreatedTO } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ChatUserDto } from './dto/chat-user.dto';
// import { BannedDto } from '../dto/banned.dto';
// import { BannedEntity } from '../entities/banned.entity';
// import { MessagesEntity } from '../entities/messages.entity';
// import { createMessageDto, returnMessageDto } from '../dto/messages.dto';
// import { returnUserDto } from '../dto/userChannels.dto';

@Controller('channels')
@ApiTags('channels')
export class ChannelsController {
  constructor(
    private readonly channelsService: ChannelsService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  @Get('all')
  async findAll(): Promise<ReturnChanelDto[]> {
    return this.channelsService.findAll();
  }

  @Get('public')
  async findPublic(): Promise<ReturnChanelDto[]> {
    return this.channelsService.findAllPublicChannels();
  }

  @Get('usersPrivate/:id')
  async findPrivate(
    @Param('id') userId: number
    ){
    return  this.channelsService.findUserPrivateChats(userId);
  }

  @Get(':chat_id')
  async findOne(
    @Param('chat_id') chat_id: number
    ): Promise<ReturnChanelDto> {
    return this.channelsService.findOne(chat_id);
  }

  @Get('owner/:id')
  async owner(
    @Param('id') id: number
    ): Promise<ChatUserDto> {
    const owner = await this.channelsService.getOwnerById(id);
    if (!owner)
      throw new NotFoundException('UserNotFound');
    return owner;
  }

  @Post('create')
  async create(
    @Body() dto: ChannelCreatedTO
    ): Promise<ReturnChanelDto> {
     return this.channelsService.create(dto);
  }

  @Post('delete/:chat_id')
  async delete(
    @Param('chat_id') chat_id: number
  ): Promise<ReturnChanelDto>{
    return this.channelsService.delete(chat_id);
  }

  @Post('update/:chat_id')
  async update(
    @Param('chat_id') chat_id: number,
    @Body() dto: UpdateChannelDto
  ): Promise<ReturnChanelDto>{
    return this.channelsService.update(chat_id, dto);
  }

  @Post(':chat_id/addUser/:user_id')
  async addUser(
    @Param('chat_id') chat_id: number,
    @Param('user_id') user_id: number,
  ): Promise<void> {
    try{
      await this.channelsService.addUserToChat(chat_id, user_id);
    } catch(error){
      throw new NotFoundException(error.message,'Not Found');
    }
  }

  @Get('users/:id')
  async getUsers(
    @Param('id') id: number
    ): Promise<ChatUserDto[]> {
    try {
      return await this.channelsService.findAllUsers(id);
    } catch (error) {
      throw new NotFoundException(error.message,'Not Found');
    }
  }

  @Post(':chat_id/addAdmin/:user_id')
  async addAdmin(
    @Param('chat_id') chat_id: number,
    @Param('user_id') user_id: number,
  ): Promise<void> {
    try{
      await this.channelsService.addAdminToChat(chat_id, user_id);
    } catch(error){
      throw new NotFoundException(error.message,'Not Found');
    }
  }

  @Post(':chat_id/removeAdmin/:admin_id')
  async removeAdmin(
    @Param('chat_id') chatId: number,
    @Param('admin_id') adminId: number,
  ): Promise<void> {
    try {
      await this.channelsService.removeAdminFromChat(chatId, adminId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw error;
      }
    }
  }


  @Get('admins/:chat_id')
  async getAdmins( @Param('chat_id') chat_id: number): Promise<ChatUserDto[]>{
    try {
      return await this.channelsService.findAllAdmins(chat_id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new Error('An error occurred while banning the user');
    }
  }

  // @Get('bannedUsers/:id')
  // async getBanned( @Param('id')id: number): Promise<BannedEntity[]>{
  //   return this.channelsService.findBanned(id);
  // }

  // @Post(':chatId/banUser/:adminId')
  // async addBannedUserToChat(
  //   @Param('chatId') chatId: number,
  //   @Param('adminId') adminId: number,
  //   @Body() body: { banned_user: number; ban_reason: string },
  // ) {
  //   body.banned_user = 2;
  //   body.ban_reason = "ban";
  //   return await this.channelsService.addBannedUserToChat(chatId, body.banned_user, adminId, body.ban_reason);
  // }

  // @Post(':chatId/removeBanned/:bannedId')
  // async removeBanned(
  //   @Param('bannedId') bannedId: number,
  //   @Param('chatId') chatId: number,
  //   ) {
  //     const chat = await this.channelsService.findOne(chatId)
  //     if (!chat) {
  //       throw new NotFoundException('Chat not found');
  //     }
  //     if (chat.banned_users && chat.banned_users.find(banned => banned.banned_user.id === bannedId)) {
  //       throw new NotFoundException('User already banned in this chat');
  //     }
  //     return this.channelsService.removeBanned(bannedId, chatId)
  //   }

    // @Post('channels/:chatId/createmessage')
    // async createMessage(
    //   // @Param('chatId') chatId: number,
    //   @Body() dto: createMessageDto,
    //   ){
    //     // body.message = "bgd";
    //     // body.userId = 3;
    //     await this.channelsService.createMessage(dto.chatId, dto.message, dto.userId);
    //   }

    //   @Get('channels/:chatId/messages')
    //   async chatMessages(
    //     @Param('chatId') chatId: number,
    //   ): Promise<returnMessageDto[]>{
    //     return await this.channelsService.getAllMessages(chatId);
    //   }

    // @Post('channels/:chatId/mute/:muteId')
    // async muteuUser(
    //   @Param('chatId') chatId: number,
    //   @Param('muteId') muteId: number,
    //   @Body() body: {Date?: string | null, muteBy: number}
    // ): Promise<void>{
    //   // Logger.log(muteId);
    //   body.muteBy = 3;
    //   return await this.channelsService.muteUser(muteId, chatId, body.muteBy, null)
    // }

    // @Post('channels/unmute/:mutedId')
    // async unMute(
    //   @Param('mutedId') mutedId: number,
    // ): Promise<void>{
    //   return await this.channelsService.unMute(mutedId);
    // }

    @Post('channels/:chat_id/joinChat/:user_id')
    async join(
      @Param('chat_id') chat_id: number,
      @Param('user_id') user_id: number,
    ): Promise<void>{
      return await this.channelsService.joinChannel(chat_id, user_id);
    }

    @Post('channels/:chat_id/quitChat/:userId')
    async quit(
      @Param('chat_id') chat_id: number,
      @Param('user_id') user_id: number,
    ): Promise<void>{
      return await this.channelsService.quitChannel(chat_id, user_id);
    }

    @Get('channels/:chat_id/activrUsers')
    async active(
      @Param('chat_id') chat_id: number,
    ): Promise<ChatUserDto[]>{
      return await this.channelsService.getActiveUsers(chat_id);
    }
}