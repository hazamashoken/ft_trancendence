import { Repository } from 'typeorm';
import { Friends } from '@backend/typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friends) private friendsRepository: Repository<Friends>,
  ) {}

  list() {
    return this.friendsRepository.find();
  }
}
