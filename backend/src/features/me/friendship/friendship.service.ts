import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Friendship,
  FriendshipStatus,
} from '@backend/typeorm/friendship.entity';
import { FriendshipService as FsService } from '@backend/features/friendship/friendship.service';
import { TypeormQueryOption } from '@backend/interfaces/qeury-option.interface';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private readonly fsRepository: Repository<Friendship>,
    private readonly fsService: FsService,
  ) {}

  static isValidStatus(status: FriendshipStatus) {
    return FsService.isValidStatus(status);
  }

  list(
    userId: number,
    status?: FriendshipStatus,
    options?: TypeormQueryOption,
  ) {
    return this.fsService.list(userId, status, options);
  }

  request(userId: number, friendId: number) {
    return this.fsService.getFriend(userId, friendId).then(freindship => {
      if (freindship.status === 'REQUESTED') {
        throw new BadRequestException('User has beed sent request');
      } else if (freindship.status === 'ACCEPTED') {
        throw new BadRequestException('User has been friend');
      }
      return Promise.all([
        this.fsService.create(userId, friendId, 'REQUESTED'),
        this.fsService.create(friendId, userId, 'WAITING'),
      ]).then(res => res[0]);
    });
  }

  accept(userId: number, friendId: number) {
    return this.fsService.getFriend(userId, friendId).then(freindship => {
      if (!freindship) {
        throw new BadRequestException('User has not relation');
      }
      if (freindship.status !== 'WAITING') {
        throw new BadRequestException(
          'User can accept friend only wating status',
        );
      }
      return Promise.all([
        this.fsService.create(userId, friendId, 'ACCEPTED'),
        this.fsService.create(friendId, userId, 'ACCEPTED'),
      ]).then(res => res[0]);
    });
  }

  remove(userId: number, friendId: number) {
    return this.fsService.remove(userId, friendId);
  }
}
