import { FtService } from '@backend/shared/ft.service';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('me/account')
export class AccountController {
  constructor() {}

  @Get('')
  getTest(@Query() query: any) {
    return 'Test';
  }
}
