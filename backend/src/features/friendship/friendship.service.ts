import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Friendship,
  FriendshipStatus,
} from '@backend/typeorm/friendship.entity';
import { User } from '@backend/typeorm';
import { ResponseUtil } from '@backend/utils/response.util';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private fsRepository: Repository<Friendship>,
  ) {}

  findAll(userId?: number, status?: FriendshipStatus) {
    let where = {};
    if (userId) {
      where = Object.assign(where, {
        user: {
          id: userId,
        },
      });
    }
    if (status) {
      where = {
        ...where,
        status,
      };
    }
    return this.fsRepository.find({
      relations: {
        friend: true,
      },
      where,
    });
  }

  getByFriend(userId: number, friendId: number) {
    return this.fsRepository.findOneBy({
      user: { id: userId },
      friend: { id: friendId },
    });
  }

  async create(userId: number, friendId: number, status: FriendshipStatus) {
    if (userId === friendId) {
      throw new BadRequestException('User cannot friend yourself');
    }
    const record = await this.getByFriend(userId, friendId);
    if (record) {
      // update record
      if (record.status !== status) {
        record.status = status;
        return this.fsRepository.save(record);
      } else {
        return record;
      }
    }
    // Create new record
    const user = new User();
    const friend = new User();
    const data = new Friendship();
    friend.id = friendId;
    user.id = userId;
    data.user = user;
    data.friend = friend;
    data.status = status;
    return this.fsRepository.save(data).catch(e => {
      console.log(e.driverError);
      throw new BadRequestException(ResponseUtil.errorDatabase(e.driverError));
    });
  }

  async removeFriend(userId: number, friendId: number) {
    const record = await this.getByFriend(userId, friendId);
    if (!record) {
      throw new NotFoundException('Not found friendship');
    }
    return this.fsRepository.remove(record);
  }

  getRecord(id: number) {
    return this.fsRepository.findOneBy({ id });
  }

  removeRecord(id: number) {
    return this.fsRepository.delete(id);
  }

  static isValidStatus(status: string) {
    return status === 'REQUESTED' || status === 'ACCEPTED';
  }
}
