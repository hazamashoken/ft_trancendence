import { Repository } from 'typeorm';
import {
  UserSession,
  UserSessionStatusType,
} from '@backend/typeorm/user-session.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser } from '@backend/interfaces/auth-user.interface';
import { TypeormQueryOption } from '@backend/interfaces/qeury-option.interface';
import { TypeormUtil } from '@backend/utils/typeorm.util';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectRepository(UserSession)
    private usRepository: Repository<UserSession>,
  ) {}

  list(option?: TypeormQueryOption) {
    const findOption = TypeormUtil.setFindOption(option);
    return this.usRepository.find({
      ...findOption,
    });
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

  updateStatus(authUser: AuthUser, status: UserSessionStatusType) {
    return this.get(authUser.user.id).then(session => {
      if (!session) {
        return this.create(authUser, { status });
      }
      session.status = status;
      return this.usRepository.save(session);
    });
  }

  updateAccessToken(authUser: AuthUser) {
    return this.get(authUser.user.id).then(session => {
      if (!session) {
        return this.create(authUser, { status });
      }
      session.accessToken = authUser.accessToken;
      session.expiredTokenTimestamp = authUser.expiredTokenTimestamp;
      return this.usRepository.save(session);
    });
  }

  getSessionByToken(accessToken: string) {
    return this.usRepository.findBy({ accessToken });
  }

  static isValidUserStatus(status: UserSessionStatusType | string) {
    return status === 'ONLINE' || status === 'OFFLINE' || status === 'IN_GAME';
  }
}
