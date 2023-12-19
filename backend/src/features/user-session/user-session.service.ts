import { Repository } from 'typeorm';
import { UserSession } from '@backend/typeorm/user-session.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser } from '@backend/interfaces/auth-user.interface';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectRepository(UserSession)
    private usRepository: Repository<UserSession>,
  ) {}

  list() {
    return this.usRepository.find();
  }

  get(userId: number) {
    return this.usRepository.findOneBy({ userId });
  }

  create(authUser: AuthUser, data: any) {
    const session = new UserSession();
    const status = data.status ?? 'OFFLINE';
    session.status = status;
    session.userId = authUser.user.id;
    session.accessToken = authUser.accessToken;
    session.expiredTokenTimestamp = authUser.expiredTokenTimestamp;
    return this.usRepository.save(session);
  }

  getSessionByToken(accessToken: string) {
    return this.usRepository.findBy({ accessToken });
  }
}
