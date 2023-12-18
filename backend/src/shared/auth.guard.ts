import { AuthUser } from '@backend/interfaces/auth-user.interface';
import { FtService } from '@backend/shared/ft.service';
import { User } from '@backend/typeorm';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { DataSource } from 'typeorm';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly ftService: FtService,
    private readonly dataSource: DataSource,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth: string =
      request.headers['authorization'] || request.headers['Authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('jwt malformed');
    }
    const accessToken = auth.substring('Bearer '.length);
    let authUser: AuthUser;
    return this.ftService.oauthTokenInfo(accessToken).pipe(
      switchMap(tokenInfo => {
        authUser = {
          accessToken,
          expiredTokenTimestamp: Date.now() + tokenInfo.expires_in_seconds * 1000,
          ft: undefined,
          user: undefined,
        };
        return this.ftService.me(accessToken);
      }),
      switchMap(ft => {
        authUser.ft = ft;
        const userRepo = this.dataSource.getRepository(User);
        return userRepo.findOneBy({ intraId: ft.id });
      }),
      map(user => {
        authUser.user = user;
        request.authUser = authUser;
        return true;
      }),
      catchError(e => {
        throw new UnauthorizedException(e.message);
      }),
    );
  }
}
