import { Repository } from 'typeorm';
import { User2fa } from '@backend/typeorm/user_2fa.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { authenticator } from 'otplib';

@Injectable()
export class SecurityService {
  public static readonly MAX_DEVICE = 1;
  constructor(
    @InjectRepository(User2fa) private user2faRepository: Repository<User2fa>,
  ) {}

  // https://wanago.io/2021/03/08/api-nestjs-two-factor-authentication/
  get2faDevices(userId: number) {
    return this.user2faRepository.find({
      relations: { user: true },
      where: { user: { id: userId } },
    });
  }

  register2faDevice(userId: number) {
    const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';
    const token = authenticator.generate(secret);
    const genSecret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(username, process.env.PROJECT_NAME, secret);
    return { genSecret, token, otpAuthUrl };
  }

  activate2faDevice(id: number) {
    return '';
  }
}
