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

  get(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  create(data: FtUser) {
    const user = new User();
    user.intraId = data.id;
    user.intraLogin = data.login;
    user.intraUrl = data.url;
    user.firstName = data.first_name;
    user.lastName = data.last_name;
    user.email = data.email;
    user.displayName = data.login;
    user.imageUrl = data.image.link;
    return this.userRepository.save(user);
  }

  update(id: number, data: Partial<User>) {
    return this.userRepository
    .update({ id }, data)
    .then(() => this.userRepository.findOneBy({ id }))
    .catch((e) => {
      console.log(e);
      if (e.name === 'EntityPropertyNotFoundError') {
        throw new BadRequestException(e.message);
      }
    });
  }
}