import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlockUser } from './dto/BlockUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@backend/typeorm/user.entity';

@Injectable()
export class BlockService {
  @InjectRepository(BlockUser)
  private readonly blockRepository: Repository<BlockUser>;
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  async getAllBlockedUsers(myId: number): Promise<User[]> {
    const blockedRelations = await this.blockRepository.find({
      where: { blockedBy: { id: myId } },
      relations: ['blockedUser'],
    });
    if (!blockedRelations) return [];
    return blockedRelations.map(relation => relation.blockedUser);
  }

  async blockUser(myId: number, userId: number): Promise<User[]> {
    const blockRelation = new BlockUser();
    blockRelation.blockedBy = await this.userRepository.findOneBy({ id: myId }); // Assuming this is a User entity or ID
    blockRelation.blockedUser = await this.userRepository.findOneBy({
      id: userId,
    }); // Assuming this is a User entity or ID

    if (!blockRelation.blockedBy || !blockRelation.blockedUser) {
      throw new NotFoundException('User not found');
    }

    // if user is already blocked

    const blockedRelation = await this.blockRepository.findOne({
      where: {
        blockedBy: { id: myId },
        blockedUser: { id: userId },
      },
    });

    if (blockedRelation) {
      throw new ConflictException('User already blocked');
    }

    await this.blockRepository.save(blockRelation);

    return await this.getAllBlockedUsers(myId);
  }

  async unBlockUser(myId: number, userId: number): Promise<User[]> {
    const blockRelation = await this.blockRepository.findOne({
      where: {
        blockedBy: { id: myId },
        blockedUser: { id: userId },
      },
    });
    if (!blockRelation) {
      throw new NotFoundException('User not blocked');
    }
    await this.blockRepository.remove(blockRelation);
    return await this.getAllBlockedUsers(myId);
  }
}
