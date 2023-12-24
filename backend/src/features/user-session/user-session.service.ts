import { Repository } from 'typeorm';
import {
  UserSession,
  UserSessionStatusType,
} from '@backend/typeorm/user-session.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser } from '@backend/interfaces/auth-user.interface';
import { TypeormQueryOption } from '@backend/interfaces/query-option.interface';
import { TypeormUtil } from '@backend/utils/typeorm.util';
import { BehaviorSubject, from } from 'rxjs';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectRepository(UserSession)
    private usRepository: Repository<UserSession>,
  ) {}

  list(option?: TypeormQueryOption) {
    const findOption = TypeormUtil.setFindOption(option);
    return this.usRepository.find({
      relations: {
        user: true,
      },
      ...findOption,
      order: {
        status: 'ASC',
      },
    });
  }

  get(userId: number) {
    return this.usRepository.findOneBy({ id: userId });
  }

  create(authUser: AuthUser, data: any) {
    const session = new UserSession();
    session.id = data.id ?? authUser.user.id;
    session.status = data.status ?? 'OFFLINE';
    // session.accessToken = authUser.accessToken;
    // session.expiredTokenTimestamp = authUser.expiredTokenTimestamp;
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
