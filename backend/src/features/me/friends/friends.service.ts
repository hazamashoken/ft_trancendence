import { Repository } from 'typeorm';
import { Friends } from '@backend/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendStatus } from '@backend/typeorm/friends.entity';
@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friends) private friendsRepository: Repository<Friends>,
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

  validateFriend(friend: Friends) {
    if (!friend) {
      throw new NotFoundException('Not found friend id');
    }
    return true;
  }
}
