import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@entities/user.entity';
import { FtUser } from '@backend/interfaces/ft-user.interface';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  create(data: FtUser) {
    const user = new User();
    user.intraId = data.id;
    user.intraLogin = data.login;
    user.intraUrl = data.url;
    user.firstName = data.first_name;
    user.lastName = data.last_name;
    user.email = data.email;
    user.displayName = data.displayName;
    user.avatarUrl = data.image.link;
    return this.userRepository.save(user);
  }
}
