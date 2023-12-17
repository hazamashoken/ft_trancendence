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
import { TypeormUtil } from '@backend/utils/typeorm.util';
import { TypeormQueryOption } from '@backend/interfaces/qeury-option.interface';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private fsRepository: Repository<Friendship>,
  ) {}

  static isValidStatus(status: string) {
    return status === 'REQUESTED' || status === 'ACCEPTED';
  }

  get(id: number) {
    return this.fsRepository.findOneBy({ id });
  }

  delete(id: number) {
    return this.fsRepository.delete(id);
  }

  list(
    userId?: number,
    status?: FriendshipStatus,
    option?: TypeormQueryOption,
  ) {
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
    const findOption = TypeormUtil.setFindOption(option);
    return this.fsRepository.find({
      relations: {
        friend: true,
      },
      where,
      ...findOption,
    });
  }

  getFriend(userId: number, friendId: number) {
    return this.fsRepository.findOneBy({
      user: { id: userId },
      friend: { id: friendId },
    });
  }

  async create(userId: number, friendId: number, status: FriendshipStatus) {
    if (userId === friendId) {
      throw new BadRequestException('User cannot friend yourself');
    }
    const record = await this.getFriend(userId, friendId);
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

  async remove(userId: number, friendId: number) {
    return this.getFriend(userId, friendId).then(record => {
      if (!record) {
        throw new NotFoundException('Not found friendship');
      }
      return this.fsRepository.remove(record);
    });
  }
}
