import { FtService } from '@backend/shared/ft.service';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable, map, switchMap } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly ftService: FtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth: string = request.headers['authorization'] || request.headers['Authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      return false;
    }
    const token = auth.substring('Bearer '.length);
    return this.ftService.oauthTokenInfo(token).pipe(
      switchMap(() => this.ftService.me(token)),
      map((me) => {
        request.user = me;
        return true;
      }),
    );
  }
}
