import { BannedEntity } from '@backend/typeorm/banned.entity';
import { ChannelsEntity, ChannelType } from '@backend/typeorm/channel.entity';
import { MessagesEntity } from '@backend/typeorm/messages.entity';
import { MutedEntity } from '@backend/typeorm/muted.entity';
import { ForbiddenException, HttpCode, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@backend/typeorm';
import { ChatUserDto } from '@backend/user/dto/chat-user.dto';
import { ReturnChanelDto } from './dto/return-cnannel.dto';
import { plainToClass } from 'class-transformer';
import { ChannelCreatedTO } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
// import { BannedService } from '../banned/banned.service';
// import { MessagesService } from '../messages/messages.service';
// import { MutedService } from '../muted/muted.service';
// import { returnMessageDto } from '../dto/messages.dto';
// import { returnUserDto } from '../dto/userChannels.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository (MutedEntity)
    private readonly mutedRepository: Repository<MutedEntity>,
    @InjectRepository(ChannelsEntity)
    private readonly channelsRepository: Repository<ChannelsEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // @InjectRepository (MessagesEntity)
    // private readonly bannedService: BannedService,
    // private readonly messageService: MessagesService,
    // private readonly mutedService: MutedService,
  ) {}

  async findAll(): Promise<ReturnChanelDto[]> {
    const channels =  await this.channelsRepository.find();

    return plainToClass(ReturnChanelDto, channels);
  }

  async findAllPublicChannels(): Promise<ReturnChanelDto[]> {
    const channels = await this.channelsRepository
      .createQueryBuilder('channel')
      .where('channel.chanel_type = :chanel_type', { chanel_type: 'public' })
      .getMany();

    return plainToClass(ReturnChanelDto, channels);
  }

  async findOne(id: number): Promise<ReturnChanelDto> {
    const channel = await this.channelsRepository.findOne({where:{chat_id: id}});
    if (!channel)
      throw new NotFoundException('channelNotFound')
    return plainToClass(ReturnChanelDto, channel);
  }

  async create(dto: ChannelCreatedTO): Promise<ReturnChanelDto> {

    const owner = await this.userRepository.findOne({where: {id: dto.chanel_owner}});
    if (!owner) {
      throw new NotFoundException('User not found');
    }

    const existingChannel = await this.channelsRepository.findOne({
      where: { chat_name: dto.chat_name },
    });
    if (existingChannel) {
      throw new ForbiddenException('Chanel with this name already exist');
    }

    const newChannel = new ChannelsEntity();
    newChannel.chat_users = [];
    newChannel.chat_users.push(owner);
    newChannel.chat_name = dto.chat_name;
    newChannel.chanel_owner = owner;
    newChannel.password = dto.password || null;
    newChannel.max_users = dto.max_users || null;
    newChannel.chanel_type = dto.chanel_type;

    const chanel = await this.channelsRepository.save(newChannel);
    return plainToClass(ReturnChanelDto, chanel);
  }

  async delete(chatId: number): Promise<ReturnChanelDto> {
    const chat = await this.channelsRepository.findOne({where: {chat_id: chatId}});

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }
    chat.chat_admins = [];
    chat.chat_users = [];

    await this.channelsRepository.save(chat);

    await this.channelsRepository.remove(chat);

    return plainToClass(ReturnChanelDto, chat);
  }

  async update(chat_id: number, dto: UpdateChannelDto): Promise<ReturnChanelDto> {
    const chat = await this.channelsRepository.findOne({where: {chat_id:  chat_id}})
    if(!chat)
      throw new NotFoundException('Channel not found');

    if (await this.channelsRepository.findOne({where: {chat_name: dto.chat_name}}))
      throw new ForbiddenException(`Channle with name ${dto.chat_name} already exist`)
      if (dto.chat_name != null) {
        chat.chat_name = dto.chat_name;
      }

      if (dto.password != null) {
        chat.password = dto.password;
      }

      if (dto.max_users != null) {
        chat.max_users = dto.max_users;
      }

      const updatedChat = await this.channelsRepository.save(chat);

      return plainToClass(ReturnChanelDto, updatedChat);
  }

  async findUserPrivateChats(user_id: number): Promise<ReturnChanelDto[]> {
    const channels =  await this.channelsRepository.find({
      where: {
        chat_users: await this.userRepository.findOne({where: {id: user_id}}),
        chanel_type: ChannelType.PRIVATE,
      },})
      const channelsDTOs = plainToClass(ReturnChanelDto, channels);

      return channelsDTOs;
  }

  async findUserProtectedChats(user_id: number): Promise<ReturnChanelDto[]> {
    const channels =  await this.channelsRepository.find({
      where: {
        chat_users: await this.userRepository.findOne({where: {id: user_id}}),
        chanel_type: ChannelType.PROTECTED,
      },})
      const channelsDTOs = plainToClass(ReturnChanelDto, channels);

      return channelsDTOs;
  }

  async getOwnerById(user_id: number): Promise<ChatUserDto> {
    const owner = await this.userRepository.findOne({where: {id: user_id}});

    return plainToClass(ChatUserDto, owner);
  }

  async findAllUsers(chatId: number): Promise<ChatUserDto[] | undefined> {
  const chat = await this.channelsRepository
  .createQueryBuilder('chat')
  .leftJoinAndSelect('chat.chat_users', 'users')
  .where('chat.chat_id = :chatId', { chatId })
  .leftJoinAndSelect('chat.chanel_owner', 'owner')
  .getOne();

    if (!chat) {
    throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    return plainToClass(ChatUserDto, chat.chat_users)
  }

  async findAllAdmins(chatId: number): Promise<ChatUserDto[] | undefined> {
    const chat = await this.channelsRepository
    .createQueryBuilder('chat')
    .leftJoinAndSelect('chat.chat_admins', 'users')
    .where('chat.chat_id = :chatId', { chatId })
    .getOne();
  
      if (!chat) {
      throw new Error(`Chat with ID ${chatId} not found`);
      }
      return plainToClass(ChatUserDto, chat.chat_admins)
    }

    async addUserToChat(id: number, user_id: number): Promise<void> {
      const chat = await this.channelsRepository.findOne({
        where:
        { chat_id: id },
        relations: ['chat_users'],
      });

      const existingUser = await this.userRepository.findOne({ where: { id: user_id } });
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }
    
      if (!chat) {
        throw new NotFoundException('Chat not found');
      }
      if ( chat.chat_users.find(userA => userA.id == user_id))
        throw new ForbiddenException(`User already exist in this chat`)
      if(chat.chat_users.length >= chat.max_users && chat.max_users != null)
        throw new ForbiddenException('Chat is full plese extend ur channel or remove user from it');
      if (!chat.chat_users) {
        chat.chat_users = [];
        chat.chat_users.push(chat.chanel_owner)
      }
      chat.chat_users.push(existingUser);
     
      await this.channelsRepository.save(chat);
    }

  async addAdminToChat(id: number, user_id: number): Promise<void> {
    const chat = await this.channelsRepository.findOne({
      where:
      {chat_id: id},
      relations: ['chat_admins'],
    });

    if (!(await this.userRepository.findOne({where: {id: user_id}})))
    {
      throw new NotFoundException('User not found')
    }
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    // Logger.warn(chat.chat_admins);
    if (chat.chat_admins.length < 1) {
      chat.chat_admins = [];
    }
    const user = await this.userRepository.findOne({where: {id: user_id}});
    chat.chat_admins.push(user);
      // Logger.warn(chat.chat_users[0]);
    await this.channelsRepository.save(chat);
  }

  async removeAdminFromChat(chatId: number, adminId: number): Promise<ChannelsEntity> {
    // Найти чат по chatId
    const chat = await this.channelsRepository.findOne({
      where:
      {chat_id: chatId},
      relations: ['chat_admins', 'chanel_owner'],
    });

    
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    const adminToRemove = chat.chat_admins.find(admin => admin.id == adminId);

    if (!adminToRemove) {
      throw new NotFoundException('Admin not found in this chat');
    }
    chat.chat_admins = chat.chat_admins.filter(admin => admin.id != adminId);
    return this.channelsRepository.save(chat);
  }

  // async addBannedUserToChat(chatId: number, bannedId: number, adminId: number, reason: string): Promise<void>{
  //   await this.bannedService.createBanned(chatId, bannedId, adminId, reason);
  // }

  // async findBanned(chatId: number): Promise<BannedEntity[]>{
  //   // const chat = this.channelsRepository.findOne({where: {chat_id: chatId}})
  //   return this.bannedService.findAllBannedUsersInChat(chatId);
  // }

  // async removeBanned(userId: number, chatId: number): Promise<void>{
  //      return await this.bannedService.removeBannedById(userId, chatId);
  // }

  // async createMessage(chatId: number, message: string, userId: number)
  // {
  //   await this.messageService.createMessage(chatId, message, userId);
  // }

  // async getAllMessages(chatId: number): Promise<returnMessageDto[] | undefined>
  // {
  //  return await this.messageService.findAllMessagesByChannel(chatId);
  // }

  // async muteUser(userId: number, channelId: number, mutedById: number, mutedUntil?: Date | null): Promise<void>{
  //    return await this.mutedService.createMuted(userId, channelId, mutedById, mutedUntil);
  // }

  // async unMute(id: number): Promise<void>
  // {
  //   return this.mutedService.deleteMuted(id);
  // }

  async joinChannel(channelId: number, userId: number): Promise<void>
  {
    const chat = await this.channelsRepository.findOne({
      where:
      { chat_id: channelId },
      relations: ['active_users'],
    });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    const existingUser = await this.userRepository.findOne({ where: { id: userId } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    if (!chat.active_users) {
      chat.active_users = [];
    }
    chat.active_users.push(existingUser);

    await this.channelsRepository.save(chat);
  }

  async quitChannel(channelId: number, userId: number): Promise<void>
  {
    const chat = await this.channelsRepository.findOne({
      where:
      { chat_id: channelId },
      relations: ['active_users'],
    });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    if (!await this.userRepository.findOne({ where: { id: userId } })) {
      throw new NotFoundException('User not found');
    }
    chat.active_users = chat.active_users.filter(user => user.id != userId);

    await this.channelsRepository.save(chat);
  }

  async getActiveUsers(channelId: number): Promise<ChatUserDto[]>
  {
    const chat = await this.channelsRepository.findOne({
      where:
      { chat_id: channelId },
      relations: ['active_users'],
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    const activeUsersDto = plainToClass(ChatUserDto, chat.active_users);
    
    return activeUsersDto;
  }
}