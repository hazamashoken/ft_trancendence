import { MutedEntity, User, ChannelsEntity } from '@backend/typeorm';
import {
  ForbiddenException,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { ReturnMutedDto } from './dto/return-muted.dto';

@Injectable()
export class MutedService {
  constructor(
    @InjectRepository(MutedEntity)
    private readonly mutedRepository: Repository<MutedEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ChannelsEntity)
    private readonly channelRepository: Repository<ChannelsEntity>,
  ) {}

  async createMuted(
    userId: number,
    channelId: number,
    mutedById: number,
    mutedUntil?: Date | null,
  ): Promise<ReturnMutedDto[]> {
    const channel = await this.channelRepository.findOne({
      where: { chatId: channelId },
      relations: ['chatOwner', 'chatAdmins'],
    });
    const muteBy = await this.userRepository.findOne({
      where: { id: mutedById },
    });
    if (
      muteBy.id != channel.chatOwner.id &&
      !channel.chatAdmins.some((admin) => admin.id == mutedById)
    ) {
      throw new NotAcceptableException('You are not an admin in this channel');
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user.id == channel.chatOwner.id)
      throw new NotAcceptableException('U cant mute channel owner');
    if (
      (
        await this.mutedRepository.find({
          where: { user: { id: userId }, mutedAt: { chatId: channelId } },
        })
      ).length > 0
    )
      throw new ForbiddenException('User already muted at this channel');
    const newMuted = this.mutedRepository.create();
    newMuted.user = user;
    newMuted.mutedAt = channel;
    newMuted.mutedBy = muteBy;
    if (mutedUntil != null) newMuted.mutedUntill = mutedUntil;
    await this.mutedRepository.save(newMuted);
    return await this.findAllMutedAtChat(channelId);
  }

  async findAllMutedAtChat(chatId: number): Promise<ReturnMutedDto[]> {
    const mutedUsers = await this.mutedRepository.find({
      where: { mutedAt: { chatId: chatId } },
      relations: ['user', 'mutedAt', 'mutedBy'],
    });
    if (mutedUsers.length < 1) return null;
    return mutedUsers.map((mutedUser) =>
      plainToClass(ReturnMutedDto, mutedUser),
    );
  }

  async findMutedById(id: number): Promise<MutedEntity> {
    return this.mutedRepository.findOne({ where: { id: id } });
  }

  async updateMuted(
    id: number,
    mutedUntil: Date,
    chatId: number,
  ): Promise<ReturnMutedDto[] | null> {
    const existingMuted = await this.findMutedById(id);
    if (!existingMuted) {
      throw new NotFoundException('Muted user not found');
    }
    existingMuted.mutedUntill = mutedUntil;
    await this.mutedRepository.save(existingMuted);
    return this.findAllMutedAtChat(chatId);
  }

  async deleteMuted(
    mutedId: number,
    chatId: number,
  ): Promise<ReturnMutedDto[]> {
    const chat = await this.channelRepository.findOne({
      where: { chatId: chatId },
      relations: ['mutedUsers'],
    });
    if (!chat) throw new NotFoundException('Chat not found');
    if (!chat.mutedUsers.find((user) => (user.id = mutedId)))
      throw new NotFoundException('User not muted at this chat');
    if (!this.findMutedById(mutedId))
      throw new NotFoundException('User not muted');
    const muted = await this.mutedRepository.findOne({
      where: { id: mutedId },
    });
    if (!muted) throw new NotFoundException('User not muted');
    await this.mutedRepository.remove(muted);
    return await this.findAllMutedAtChat(chatId);
  }
}
