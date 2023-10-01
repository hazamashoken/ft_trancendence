import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class XKeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const xkey = request.headers['x-api-key'] || request.headers['X-Api-Key'];
    return xkey && xkey === process.env.X_API_KEY;
  }
}
