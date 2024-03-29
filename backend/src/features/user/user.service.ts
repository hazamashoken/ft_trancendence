import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@entities/user.entity';
import { FtUser } from '@backend/interfaces/ft-user.interface';
import { TypeormUtil } from '@backend/utils/typeorm.util';
import { TypeormQueryOption } from '@backend/interfaces/query-option.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  getRepository() {
    return this.userRepository;
  }

  findAll(option: TypeormQueryOption): Promise<User[]> {
    const findOption = TypeormUtil.setFindOption(option);
    return this.userRepository.find({ ...findOption });
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: { stats: true }
    });
  }

  getByIntraId(intraId: number) {
    return this.userRepository.findOne({
      where: { intraId: intraId },
      relations: ['stats']
    });
  }

  getByUsername(username: string) {
    return this.userRepository.findOneBy({
      displayName: username,
    });
  }

  create(data: Partial<User>) {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user).catch(e => {
      throw new BadRequestException(e.driverError.message);
    });
  }

  update(id: number, data: Partial<User>): Promise<void | User> {
    return this.userRepository
      .update({ id }, data)
      .then(() => this.findOne(id))
      .catch(e => {
        console.log(e);
        if (e.name === 'EntityPropertyNotFoundError') {
          throw new BadRequestException(e.message);
        }
      });
  }

  async save(id: number, data: Partial<User>): Promise<any> {
    const uBody = this.userRepository.create(data);
    const uData = await this.userRepository.findOneBy({ id });
    uBody.intraId = uData.intraId;
    return this.userRepository.save(uBody);
  }

  delete(id: number) {
    return this.userRepository.delete({ id });
  }

  static mapIntraUser(data: FtUser): Partial<User> {
    return {
      intraId: data.id,
      intraLogin: data.login,
      intraUrl: data.url,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      displayName: data.login,
      imageUrl: data.image.link,
    };
  }
}
