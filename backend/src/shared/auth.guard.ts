import { FtService } from '@backend/shared/ft.service';
import { User } from '@backend/typeorm';
import { appDataSource } from '@backend/utils/dbconfig';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { DataSource } from 'typeorm';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly ftService: FtService, private readonly dataSource: DataSource) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth: string = request.headers['authorization'] || request.headers['Authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('jwt malformed');
    }
    const token = auth.substring('Bearer '.length);
    return this.ftService.oauthTokenInfo(token).pipe(
      switchMap(() => this.ftService.me(token)),
      switchMap((ft) => {
        request.authUser = { ft };
        const userRepo = this.dataSource.getRepository(User);
        return userRepo.findOneBy({intraId: ft.id });
      }),
      map(user => {
        request.authUser = { ...request.authUser, user }
        return true;
      }),
      catchError((e) => {
        throw new UnauthorizedException(e.message)
      })
    );
  }
}
