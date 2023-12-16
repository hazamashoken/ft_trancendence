import { Repository } from 'typeorm';
import { Friendship } from '@backend/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendshipStatus } from '@backend/typeorm/friendship.entity';
@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friendship) private fsRepository: Repository<Friendship>,
  ) {}

  static isValidStatus(status: string) {
    return status === 'REQUESTED' || status === 'ACCEPTED';
  }

  list(userId: number, status?: FriendshipStatus) {
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
    return this.fsRepository.find({
      relations: {
        user: true,
      },
      where: whereCondition,
    });
  }

  get(id: number) {
    return this.fsRepository.findOneBy({ id }).then((res) => {
      this.validateFriend(res);
      return res;
    });
  }

  validateFriend(friend: Friendship) {
    if (!friend) {
      throw new NotFoundException('Not found friend id');
    }
    return true;
  }
}
