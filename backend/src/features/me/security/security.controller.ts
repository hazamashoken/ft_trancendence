import { AuthGuard } from '@backend/shared/auth.guard';
import { XKeyGuard } from '@backend/shared/x-key.guard';
import {
  Controller,
  UseGuards,
  Get,
  BadRequestException,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
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
  get2faDevice(@AuthUser('user') user: User) {
    return this.securityService.get2faDevice(user.id);
  }

  @Post('2fa')
  async register2faDevice(@AuthUser('user') user: User) {
    const tfa = await this.securityService.get2faDevice(user.id);
    if (tfa && tfa.status === 'ACTIVE') {
      throw new BadRequestException('User has been registered device');
    }
    return this.securityService.register2faDevice(user.id, user.email);
  }

  @Patch('2fa')
  async activate2faDevice(@AuthUser('user') user: User) {
    const tfa = await this.securityService.get2faDevice(user.id);
    console.log(tfa);
    if (!tfa) {
      throw new BadRequestException('User has not been registered device');
    }
    if (tfa.status === 'ACTIVE') {
      throw new BadRequestException('User already activated device');
    }
    return this.securityService.activate2faDevice(user.id);
  }

  @Delete('2fa')
  async remove2faDevice(@AuthUser('user') user: User) {
    const tfa = await this.securityService.get2faDevice(user.id);
    if (!tfa) {
      throw new BadRequestException('User has not been registered device');
    }
    return this.securityService.remove2faDevice(user.id);
  }
}
