import { FtService } from '@backend/shared/ft.service';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('ft')
export class FtController {
  constructor(private readonly ftService: FtService) {}

  @Get('oauth/token')
  oauthToken(code: string) {
    return this.ftService.oauthToken(code);
  }

  @Get('oauth/token/info')
  oauthTokenInfo(@Query() query: any) {
    return this.ftService.oauthTokenInfo(query.access_token);
  }

  @Get('oauth/token/my')
  oauthTokenMy(@Query() query: any) {
    return this.ftService.me(query.access_token);
  }
}
