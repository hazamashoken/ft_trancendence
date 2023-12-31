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
import { BehaviorSubject, Observable, Subject, from } from 'rxjs';
import { User } from '@backend/typeorm';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectRepository(UserSession)
    private usRepository: Repository<UserSession>,
  ) {}

  private onlineUsers$ = new Subject<Partial<UserSession>[]>();
  private ingameUsers$ = new Subject<Partial<UserSession>[]>();

  get onlineUsers(): Observable<Partial<UserSession>[]> {
    return this.onlineUsers$.asObservable();
  }

  get ingameUsers(): Observable<Partial<UserSession>[]> {
    return this.ingameUsers$.asObservable();
  }

  set onlineUsers(users: Partial<UserSession>[]) {
    console.log('onlineUsers:', users.length);
    this.onlineUsers$.next(users);
  }

  set ingameUsers(users: Partial<UserSession>[]) {
    console.log('ingameUsers:', users.length);
    this.ingameUsers$.next(users);
  }

  get repository() {
    return this.usRepository;
  }

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
    return this.usRepository.save(session);
  }

  createViaUser(user: User, data: any) {
    const session = new UserSession();
    session.id = data.id ?? user.id;
    session.status = data.status ?? 'OFFLINE';
    return this.usRepository.save(session);
  }

  updateStatus(authUser: AuthUser, status: UserSessionStatusType) {
    return this.get(authUser.user.id).then(session => {
      if (!session) {
        return this.create(authUser, { status });
      }
      return this.usRepository
        .update({ id: session.id }, { status })
        .then(res => this.get(session.id));
    });
  }

  updateUserStatus(user: User, status: UserSessionStatusType) {
    return this.get(user.id).then(session => {
      if (!session) {
        return this.createViaUser(user, { status });
      }
      return this.usRepository
        .update({ id: session.id }, { status })
        .then(res => this.get(session.id));
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
    return this.usRepository.findOne({
      relations: {
        user: true,
      },
      where: { accessToken },
    });
  }

  static isValidUserStatus(status: UserSessionStatusType | string) {
    return status === 'ONLINE' || status === 'OFFLINE' || status === 'IN_GAME';
  }
}
