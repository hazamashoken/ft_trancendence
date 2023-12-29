import { FtService } from '@backend/shared/ft.service';
import { ResponseUtil } from '@backend/utils/response.util';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly ftService: FtService) {}

  verify(token: string) {
    return this.ftService
      .oauthTokenInfo(token)
      .pipe(map(res => ResponseUtil.succeed(res)));
  }
}
