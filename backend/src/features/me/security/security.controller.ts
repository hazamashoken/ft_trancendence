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
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
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

  @Post('2fa/verify')
  @ApiOperation({ summary: 'verify 2fa code' })
  async verify2fa(@AuthUser('user') user: User, @Body('code') code: string) {
    const tfa = await this.securityService.get2faDevice(user.id);
    if (!tfa || tfa.status === 'INACTIVE') {
      throw new BadRequestException('User has not activated device');
    }
    if (!code) {
      throw new BadRequestException('Need code in body');
    }
    return this.securityService.verify2fa(user.id, code);
  }

  @Patch('2fa/activate')
  @ApiOperation({ summary: 'Activate 2fa device for first time' })
  async activate2faDevice(@AuthUser('user') user: User, @Body('code') code: string) {
    const tfa = await this.securityService.get2faDevice(user.id);
    if (!tfa) {
      throw new BadRequestException('User has not been registered device');
    }
    if (tfa.status === 'ACTIVE') {
      throw new BadRequestException('User already activated device');
    }
    if (!code) {
      throw new BadRequestException('Need code in body');
    }
    return this.securityService.activate2faDevice(user.id, code);
  }

  @Get('2fa')
  @ApiOperation({ summary: 'Get 2fa device for auth user' })
  get2faDevice(@AuthUser('user') user: User) {
    return this.securityService.get2faDevice(user.id);
  }

  @Post('2fa')
  @ApiOperation({ summary: 'Register a 2fa device', description: 'Server will generate register code for first active.' })
  async register2faDevice(@AuthUser('user') user: User) {
    const tfa = await this.securityService.get2faDevice(user.id);
    if (tfa && tfa.status === 'ACTIVE') {
      throw new BadRequestException('User has been registered device');
    }
    return this.securityService.register2faDevice(user.id, user.email);
  }

  @Delete('2fa')
  @ApiOperation({ summary: 'Remove 2fa device' })
  async remove2faDevice(@AuthUser('user') user: User) {
    const tfa = await this.securityService.get2faDevice(user.id);
    if (!tfa) {
      throw new BadRequestException('User has not been registered device');
    }
    return this.securityService.remove2faDevice(user.id);
  }
}
