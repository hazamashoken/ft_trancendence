import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  getRepository() {
    return this.userRepository;
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  create(data: any) {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  update(id: number, data: any): Promise<void | User> {
    return this.userRepository
      .update({ id }, data)
      .then(() => this.findOne(id))
      .catch((e) => {
        console.log(e);
        if (e.name === 'EntityPropertyNotFoundError') {
          throw new BadRequestException(e.message);
        }
      });
  }

  async save(id: number, data: any): Promise<any> {
    const uBody = this.userRepository.create(data as User);
    const uData = await this.userRepository.findOneBy({ id });
    uBody.intraId = uData.intraId;
    return this.userRepository.save(uBody);
  }

  delete(id: number) {
    return this.userRepository.delete({ id });
  }
}
