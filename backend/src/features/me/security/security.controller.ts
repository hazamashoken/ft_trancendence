import { AuthGuard } from '@backend/shared/auth.guard';
import { XKeyGuard } from '@backend/shared/x-key.guard';
import { Controller, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SecurityService } from './security.service';
import { AuthUser } from '@backend/pipe/auth-user.decorator';
import { User } from '@backend/typeorm';

@Controller('me/security')
@UseGuards(XKeyGuard, AuthGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiTags('Me')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('2fa')
  getOtpSecret(@AuthUser('user') user: User) {
    console.log(user);
    return this.securityService.register2faDevice(user.id);
  }
}
