import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Friend, FriendStatus } from '@backend/typeorm/friend.entity';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend) private friendRepository: Repository<Friend>,
  ) {}

  findAll() {
    return this.friendRepository.find();
  }

  create(userId: number, friendId: number, status: FriendStatus) {
    return 'Succeed'
  }

  removeFriend(userId: number, friendId: number) {
    
  }

  removeRecord(id: number) {

  }

  static isValidStatus(status: string) {
    return status === 'REQUESTED' || status === 'ACCEPTED';
  }
}
