import { AuthUser as AuthUserInterface } from '@backend/interfaces/auth-user.interface';
import { AuthGuard } from '@backend/shared/auth.guard';
import { XKeyGuard } from '@backend/shared/x-key.guard';
import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UserSessionService } from './user-session.service';
import { AuthUser } from '@backend/pipe/auth-user.decorator';

@Controller('user-sessions')
@UseGuards(XKeyGuard, AuthGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiTags('UserSessions')
export class UserSessionController {
  constructor(private readonly usService: UserSessionService) {}

  @Get()
  list() {
    return this.usService.list();
  }

  @Get(':id')
  get(@Param('id') id) {
    return this.usService.get(id).then(res => {
      if (!res) {
        throw new NotFoundException('Not Found User Session');
      }
      return res;
    });
  }

  @Post()
  save(@AuthUser() authUser: AuthUserInterface, @Body() body) {
    return this.usService.create(authUser, body);
  }
}
