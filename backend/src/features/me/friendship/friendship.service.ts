import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import {
  Friendship,
  FriendshipStatus,
} from '@backend/typeorm/friendship.entity';
import { FriendshipService as FsService } from '@backend/features/friendship/friendship.service';
import { TypeormQueryOption } from '@backend/utils/typeorm.util';
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
    return this.fsService.create(userId, friendId, 'REQUESTED');
  }

  accept(userId: number, friendId: number) {
    return this.fsService.create(userId, friendId, 'ACCEPTED');
  }

  remove(userId: number, friendId: number) {
    return this.fsService.remove(userId, friendId);
  }
}
