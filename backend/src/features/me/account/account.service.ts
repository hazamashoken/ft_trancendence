import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@entities/user.entity';
import { FtUser } from '@backend/interfaces/ft-user.interface';
import * as fs from 'fs'
@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  avatarValid = {
    // size less than 2MB
    size: 2 * 1024 * 1024,
    types: [
      'image/jpeg',
      'image/png',
      'image/webp'
    ]
  }

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

  saveAvatar(id: number, file: Express.Multer.File) {
    const path = `data/users/${id}/avatar`
    const filename = 'original.' + file.originalname.split('.').pop();
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    fs.writeFileSync(`${path}/${filename}`, Buffer.from(file.buffer))
    const imageUrl = `${process.env.NESTJS_URL}:${process.env.NESTJS_PORT}/${path}/${filename}`;
    return this.userRepository.update({ id }, { imageUrl })
      .then(() => this.userRepository.findOneBy({ id }));
  }

  validateAvatar(file: Express.Multer.File) {
    const { size, types } = this.avatarValid;
    return file.size <= size || types.findIndex(t => t === file.mimetype) > -1;
  }
}
