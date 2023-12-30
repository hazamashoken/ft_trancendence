import { Repository } from 'typeorm';
import { User2fa } from '@backend/typeorm/user_2fa.entity';
import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { authenticator } from 'otplib';
import { User } from '@backend/typeorm';

@Injectable()
export class SecurityService {
  public static readonly MAX_DEVICE = 1;
  constructor(
    @InjectRepository(User2fa) private user2faRepository: Repository<User2fa>,
  ) {}

  // https://wanago.io/2021/03/08/api-nestjs-two-factor-authentication/
  get2faDevice(userId: number) {
    return this.user2faRepository.findOne({
      relations: { user: true },
      where: { user: { id: userId } },
    });
  }

  async verify2fa(userId: number, code: string) {
    const tfa = await this.get2faDevice(userId);
    const token = authenticator.generate(tfa.secret);
    return { success: token === code };
  }

  register2faDevice(userId: number, username: string) {
    const projName = process.env.PROJECT_NAME;
    const secret = authenticator.generateSecret();
    const user = new User();
    user.id = userId;
    const tfa = new User2fa();
    tfa.secret = secret;
    tfa.status = 'INACTIVE';
    tfa.user = user;
    return this.user2faRepository
      .save(tfa)
      .then(() => authenticator.keyuri(username, projName, secret));
  }

  async activate2faDevice(userId: number, code: string) {
    const tfa = await this.get2faDevice(userId);
    if (!tfa) {
      throw new BadRequestException("Device hasn't registered");
    }
    if (code !== authenticator.generate(tfa.secret)) {
      throw new HttpException({ success: false }, HttpStatus.OK);
    }
    tfa.status = 'ACTIVE';
    await this.user2faRepository.save(tfa);
    return { success: true };
  }

  async remove2faDevice(userId: number) {
    const tfa = await this.get2faDevice(userId);
    await this.user2faRepository.remove(tfa);
    return { success: true };
  }
}
