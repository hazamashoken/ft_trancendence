import { BannedEntity, ChannelsEntity, User } from '@backend/typeorm';
import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { ReturnBannedDto } from './dto/return-ban.dto';
import { ChannelsService } from '@backend/channels/channels.service';

@Injectable()
export class BannedService {
  constructor(
    @InjectRepository(BannedEntity)
    private readonly bannedRepository: Repository<BannedEntity>,
    @InjectRepository(ChannelsEntity)
    private readonly channelRepository: Repository<ChannelsEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => ChannelsService))
    private readonly channelService: ChannelsService,
  ) {}

  // async findAll(): Promise<void> {
  //   const banned = await this.bannedRepository.find();
  //   Logger.log(banned[0]);
  // }

  entToDto(ent: BannedEntity) {
    const dto = new ReturnBannedDto();
    dto.id = ent.id;
    dto.bannedAt = ent.bannedAt.chatName;
    dto.banReason = ent.banReason;
    dto.bannedBy = ent.bannedBy.firstName;
    dto.bannedUser = ent.bannedUser;
    return dto;
  }

  async findAllBannedUsersInChat(chatId: number): Promise<ReturnBannedDto[]> {
    const banned = await this.bannedRepository.find({
      where: { bannedAt: { chatId: chatId } },
      relations: ['bannedUser', 'bannedBy', 'bannedAt'],
    });
    const retBanned = banned.map((ban) => {
      return this.entToDto(ban);
    });
    if (retBanned.length == 0) return null;
    return retBanned;
  }

  async findById(id: number): Promise<BannedEntity | undefined> {
    return await this.bannedRepository.findOne({ where: { id: id } });
  }

  async update(
    id: number,
    bannedData: Partial<BannedEntity>,
  ): Promise<BannedEntity | undefined> {
    await this.bannedRepository.update(id, bannedData);
    return await this.findById(id);
  }

  async remove(id: number): Promise<void> {
    try {
      await this.bannedRepository.delete(id);
    } catch (error) {
      throw new Error(
        `Error deleting banned entry with ID ${id}: ${error.message}`,
      );
    }
  }

  async createBanned(
    chatId: number,
    bannedId: number,
    adminId: number,
    reason: string,
  ): Promise<ReturnBannedDto[]> {
    const chat1 = await this.channelRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.bannedUsers', 'banned')
      .leftJoinAndSelect('chat.chatAdmins', 'admins')
      .leftJoinAndSelect('chat.chatOwner', 'owner')
      .where('chat.chatId = :chatId', { chatId })
      .getOne();
    if (!chat1) {
      throw new NotFoundException('Chat not found');
    }
    const banned_user = await this.userRepository.findOne({
      where: { id: bannedId },
    });
    if (!banned_user) {
      throw new NotFoundException('User not found');
    } else if (banned_user === chat1.chatOwner) {
      throw new ForbiddenException('U cant ban channel owner');
    }

    let banned_by = new User();

    if (chat1.chatOwner.id == adminId) {
      banned_by = chat1.chatOwner;
    } else if (
      chat1.chatAdmins.length > 0 &&
      chat1.chatAdmins.find((admin) => admin.id == adminId)
    ) {
      banned_by = chat1.chatAdmins.find((admin) => admin.id == adminId);
    } else {
      throw new ForbiddenException('User is not an admin in this channel');
    }

    if (!banned_by && banned_by.id != chat1.chatOwner.id) {
      throw new NotFoundException('Admin not found');
    } else if (
      !chat1.chatAdmins.find((admin) => admin.id == adminId) &&
      banned_by.id != chat1.chatOwner.id
    ) {
      throw new ForbiddenException('User is not an admin');
    } else if (
      chat1.chatAdmins.find((admin) => admin.id == bannedId) &&
      banned_by.id != chat1.chatOwner.id
    ) {
      throw new ForbiddenException('Only owner can ban admins');
    } else if (banned_user.id == banned_by.id) {
      throw new ForbiddenException('You cant ban urself');
    }

    const isUserBanned = await this.bannedRepository.findOne({
      where: {
        bannedUser: { id: bannedId },
        bannedAt: { chatId: chatId },
      },
      relations: ['bannedUser'],
    });

    if (isUserBanned) {
      throw new NotFoundException('User already banned at this chat');
    }

    const bannedUser = new BannedEntity();
    bannedUser.bannedUser = banned_user;
    bannedUser.bannedBy = banned_by;
    bannedUser.bannedAt = chat1;
    if (reason != null) {
      bannedUser.banReason = reason;
    }
    await this.bannedRepository
      .createQueryBuilder()
      .insert()
      .into('banned')
      .values(bannedUser)
      .execute();

    await this.channelService.removeUserFromChat(chat1.chatId, bannedId, adminId);
    return await this.findAllBannedUsersInChat(chat1.chatId);
  }

  async removeBannedById(
    bannedId: number,
    channelId: number,
    authUser: number,
  ): Promise<ReturnBannedDto[]> {
    const chat = await this.channelRepository.findOne({
      where: { chatId: channelId },
      relations: ['bannedUsers'],
    });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    if(chat.chatOwner.id != authUser && chat.chatAdmins.find((admin) => admin.id == authUser))
      throw new ForbiddenException(`Only owner can remove banned user from chat`);
    if (
      chat.bannedUsers &&
      chat.bannedUsers.length > 0 &&
      chat.bannedUsers.find(
        (banned) => banned.bannedUser && banned.bannedUser.id != bannedId,
      )
    ) {
      throw new NotFoundException('User not found at this chat');
    }
    const banned = await this.bannedRepository.findOne({
      where: { bannedUser: { id: bannedId }, bannedAt: { chatId: channelId } },
    });
    if (banned == null) {
      throw new NotFoundException(`Banned user with ID ${bannedId} not found`);
    }
    await this.bannedRepository.remove(banned);
    return await this.findAllBannedUsersInChat(channelId);
  }

  async unbanUser (chatId: number, userId: number, authUser: number): Promise<ReturnBannedDto[]> {
    const chat = await this.channelRepository.findOne({
      where: { chatId: chatId },
      relations: ['bannedUsers', 'chatOwner', 'chatAdmins'],
    });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    if(chat.chatOwner.id != authUser && chat.chatAdmins.find((admin) => admin.id == authUser))
      throw new ForbiddenException(`Only owner and admins can remove unban user`);
    if (
      chat.bannedUsers &&
      chat.bannedUsers.length > 0 &&
      chat.bannedUsers.find(
        (banned) => banned.bannedUser && banned.bannedUser.id != userId,
      )
    ) {
      throw new NotFoundException('User not found at this chat');
    }
    const banned = await this.bannedRepository.findOne({
      where: { bannedUser: { id: userId }, bannedAt: { chatId: chatId } },
    });
    if (banned == null) {
      throw new NotFoundException(`Banned user with ID ${userId} not found`);
    }
    await this.bannedRepository.remove(banned);
    return await this.findAllBannedUsersInChat(chatId);
  }
}
