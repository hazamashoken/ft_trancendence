import { AuthUser } from '@backend/interfaces/auth-user.interface';
import { appDataSource } from '@backend/utils/dbconfig';

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Observable, catchError, from, map, of, switchMap } from 'rxjs';
import { WsException } from '@nestjs/websockets';
import { UserSession } from '@backend/typeorm/user-session.entity';
import { User } from '@backend/typeorm/user.entity';

// await appDataSource.initialize();
@Injectable()
export class SocketAuthGuard implements CanActivate {
  constructor() {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    if (context.getType() !== 'ws') {
      return true;
    }
    return SocketAuthGuard.validateClient(client);
  }

  static validateClient(client: any) {
    let auth : string;
    if (client.handshake.headers['authorization'] || client.handshake.headers['Authorization']) {
      auth = client.handshake.headers['authorization'] || client.handshake.headers['Authorization']; // eslint-disable-line prettier/prettier
    }
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('jwt malformed');
    }
    const accessToken = auth.substring('Bearer '.length);
    client.handshake.auth = {
      accessToken,
    };
    return !!accessToken;
  }
}
