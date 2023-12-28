import { AuthUser } from '@backend/interfaces/auth-user.interface';
import { FtService } from '@backend/shared/ft.service';
import { User, UserSession } from '@backend/typeorm';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { EMPTY, Observable, catchError, from, map, of, switchMap } from 'rxjs';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  private userRepo: Repository<User>;
  private usRepo: Repository<UserSession>;
  constructor(
    private readonly ftService: FtService,
    private readonly dataSource: DataSource,
  ) {
    this.userRepo = this.dataSource.getRepository(User);
    this.usRepo = this.dataSource.getRepository(UserSession);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth: string =
      request.headers['authorization'] || request.headers['Authorization']; // eslint-disable-line prettier/prettier
    Logger.log(auth, 'AuthGaurd Check Token');
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('jwt malformed');
    }
    const accessToken = auth.substring('Bearer '.length);
    let authUser: AuthUser;
    console.log('Token:', accessToken);
    return from(this.usRepo.findOneBy({ accessToken })).pipe(
      switchMap(session => {
        if (!session) {
          console.log('AuthGaurd Check Token Info');
          return this.refreshFtUserCache(accessToken);
        } else {
          console.log('AuthGaurd Retrieve user session');
          return of({
            ftUser: session.ftUser,
            accessToken: session.accessToken,
            expiredTokenTimestamp: session.expiredTokenTimestamp,
          });
        }
      }),
      switchMap(session => {
        authUser = {
          ft: session.ftUser,
          user: undefined,
          accessToken: session.accessToken,
          expiredTokenTimestamp: session.expiredTokenTimestamp,
        };
        return this.userRepo.findOneBy({ intraId: session.ftUser.id });
      }),
      map(user => {
        authUser.user = user;
        request.authUser = authUser;
        return true;
      }),
      catchError(e => {
        console.log(e);
        throw new UnauthorizedException(e.message);
      }),
    );
  }

  refreshFtUserCache(accessToken: string): Observable<Partial<UserSession>> {
    const userSession = new UserSession();
    return this.ftService.oauthTokenInfo(accessToken).pipe(
      switchMap(tokenInfo => {
        console.log('tokenInfo:', tokenInfo);
        userSession.accessToken = accessToken;
        userSession.expiredTokenTimestamp =
          Date.now() + tokenInfo.expires_in_seconds * 1000; // eslint-disable-line prettier/prettier
        return this.ftService.me(accessToken);
      }),
      switchMap(ft => {
        console.log(ft);
        userSession.ftUser = ft;
        return this.userRepo.findOneBy({ intraId: ft.id });
      }),
      switchMap(user => {
        if (!user) {
          return from(of({}));
        } else {
          userSession.id = user.id;
          userSession.status = 'OFFLINE';
          return from(this.saveSession(userSession));
        }
      }),
      map(() => userSession),
    );
  }

  saveSession(userSession) {
    return this.usRepo.findOneBy({ id: userSession.id }).then(session => {
      if (session) {
        session.ftUser = userSession.ftUser;
        session.accessToken = userSession.accessToken;
        session.expiredTokenTimestamp = userSession.expiredTokenTimestamp;
        userSession.status = session.status;
        return this.usRepo.save(session);
      }
      return this.usRepo.save(userSession);
    });
  }
}
