import {
  MessagesEntity,
  ChannelsEntity,
  User,
  MutedEntity,
} from '@backend/typeorm';
import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ReturnCursorMessageDto,
  ReturnMessageDto,
} from './dto/return-message.dto';
import { plainToClass } from 'class-transformer';
import { take } from 'rxjs';
import { PaginationDto } from './dto/pagination.dto';
import { BlockService } from '../block/blockUser.service';
import { ChannelsService } from '../channels/channels.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesEntity)
    private readonly messagesRepository: Repository<MessagesEntity>,
    @InjectRepository(ChannelsEntity)
    private readonly channelRepository: Repository<ChannelsEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(MutedEntity)
    private readonly mutedRepository: Repository<MutedEntity>,
    private readonly blockUserService: BlockService,
    @Inject(forwardRef(() => ChannelsService))
    private readonly channelService: ChannelsService,
  ) {}

  async createMessage(
    channelId: number,
    message: string,
    authorId: number,
  ): Promise<ReturnMessageDto> {
    const channel = await this.channelRepository.findOne({
      where: { chatId: channelId },
      relations: ['mutedUsers', 'mutedUsers.user', 'bannedUsers'],
    });
    if (!channel) throw new NotFoundException('ChannelNotFound');
    const author = await this.userRepository.findOne({
      where: { id: authorId },
    });
    if (!author) throw new NotFoundException('User dont exist at this channel');
    const date = new Date();
    const user = channel.mutedUsers.find(user => user.user.id == authorId);
    if (user?.mutedUntill <= date)
      await this.channelService.unMute(authorId, channelId, authorId);
    if (user) {
      throw new ForbiddenException('User is muted');
    }
    if (channel.bannedUsers.find(user => user.id == authorId) != undefined) {
      throw new ForbiddenException('User is banned at this channel');
    }
    const newMessage = new MessagesEntity();
    newMessage.message = message;
    newMessage.author = author;
    newMessage.channel = channel;
    await this.messagesRepository.save(newMessage);
    return plainToClass(ReturnMessageDto, newMessage);
  }

  async findAllMessagesByChannel(
    channelId: number,
    authUser: number,
    cursor = 0,
  ): Promise<ReturnMessageDto[]> {
    const channel = await this.channelRepository.findOne({
      where: { chatId: channelId },
      relations: ['chatUsers'],
    });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    if (channel.chatUsers.find(user => user.id == authUser) == undefined) {
      throw new ForbiddenException('You are not a member of this channel');
    }
    const blockedUsers = await this.blockUserService.getAllBlockedUsers(
      authUser,
    );
    const blockedUserIds = new Set(blockedUsers.map(user => user.id));

    const messages = await this.messagesRepository
      .createQueryBuilder('messages')
      .innerJoinAndSelect('messages.author', 'author')
      .andWhere('messages.channel = :channelId', { channelId })
      .orderBy('messages.createAt', 'DESC')
      .limit(100)
      .getMany();

    messages.reverse();

    const filteredMessages = messages.filter(message => {
      // Assuming 'message.author' has an 'id' property
      return !blockedUserIds.has(message.author.id);
    });

    const formattedMessages: ReturnMessageDto[] = filteredMessages.map(
      message => ({
        massageId: message.messageId,
        message: message.message,
        athor: message.author, // Предполагается, что в MessageEntity есть связь с автором
        createAt: message.createAt,
        updateAt: !message.updateAt ? null : message.updateAt,
      }),
    );

    return formattedMessages;
  }

  // async findMessageById(id: number): Promise<MessagesEntity | null> {
  //   return this.messagesRepository.findOne({ where: { messageId: id } });
  // }

  // async updateMessage(
  //   id: number,
  //   message: string,
  //   authUser: number,
  // ): Promise<ReturnMessageDto | null> {
  //   const existingMessage = await this.findMessageById(id);
  //   if (!existingMessage) {
  //     throw new NotFoundException('Message not found');
  //   }
  //   if (existingMessage.author.id != authUser)
  //     throw new ForbiddenException('You are not the author of this message');
  //   existingMessage.message = message;
  //   existingMessage.updateAt = new Date();
  //   this.messagesRepository.save(existingMessage);

  //   return plainToClass(ReturnMessageDto, existingMessage);
  // }

  // async deleteMessage(
  //   messageId: number,
  //   chatId: number,
  //   authUser: number,
  // ): Promise<ReturnMessageDto[]> {
  //   const chat = await this.channelRepository.findOne({
  //     where: { chatId: chatId },
  //     relations: ['chatMessages'],
  //   });
  //   if (!chat) throw new NotFoundException('Chat not found');
  //   const existMess = chat.chatMessages.find(
  //     message => message.messageId == messageId,
  //   );
  //   if (existMess.author.id != authUser) {
  //     throw new ForbiddenException('You are not the author of this message');
  //   }
  //   if (!existMess)
  //     throw new NotFoundException('Message not found at this chat');

  //   await this.messagesRepository.delete(messageId);
  //   return await this.findAllMessagesByChannel(chatId, authUser);
  // }
}
