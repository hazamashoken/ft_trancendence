import { Repository } from 'typeorm';
import { Friend } from '@backend/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendStatus } from '@backend/typeorm/friend.entity';
@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend) private friendsRepository: Repository<Friend>,
  ) {}

  static isValidStatus(status: string) {
    return status === 'REQUESTED' || status === 'ACCEPTED';
  }

  list(userId: number, status?: FriendStatus) {
    let whereCondition = {
      user: {
        id: userId,
      },
    };
    if (status) {
      whereCondition = Object.assign(whereCondition, {
        status,
      });
    }
    return this.friendsRepository.find({
      relations: {
        user: true,
      },
      where: whereCondition,
    });
  }

  get(id: number) {
    return this.friendsRepository.findOneBy({ id }).then((res) => {
      this.validateFriend(res);
      return res;
    });
  }

  validateFriend(friend: Friend) {
    if (!friend) {
      throw new NotFoundException('Not found friend id');
    }
    return true;
  }
}
