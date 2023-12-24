import { AuthUser } from '@backend/pipe/auth-user.decorator';
import { AuthUser as AuthUserInterface } from '@backend/interfaces/auth-user.interface';
import { AuthGuard } from '@backend/shared/auth.guard';
import { XKeyGuard } from '@backend/shared/x-key.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { SessionService } from './session.service';
import { UpdateUserSessionDto } from '@backend/features/user-session/dto/update-user-session.dto';

@Controller('me/session')
@UseGuards(XKeyGuard, AuthGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiTags('Me')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  @ApiOperation({ summary: 'Get my user session' })
  get(@AuthUser() authUser: AuthUserInterface) {
    if (!authUser.user) {
      throw new BadRequestException('User has not been created');
    }
    return this.sessionService.get(authUser.user.id);
  }

  @Post('status')
  updateStatus(
    @AuthUser() authUser: AuthUserInterface,
    @Body() body: UpdateUserSessionDto,
  ) {
    return this.sessionService.updateStatus(authUser, body.status);
  }
}
