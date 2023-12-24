import { AuthUser as AuthUserInterface } from '@backend/interfaces/auth-user.interface';
import { AuthGuard } from '@backend/shared/auth.guard';
import { XKeyGuard } from '@backend/shared/x-key.guard';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { UserSessionService } from './user-session.service';
import { AuthUser } from '@backend/pipe/auth-user.decorator';
import { UpdateUserSessionDto } from './dto/update-user-session.dto';
import { QueryOptionDto } from '@backend/dto/query-option.dto';
import { QueryOption } from '@backend/pipe/query-option.decorator';

@Controller('user-sessions')
@UseGuards(XKeyGuard, AuthGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiTags('UserSessions')
export class UserSessionController {
  constructor(private readonly usService: UserSessionService) {}

  @Get()
  @ApiOperation({ summary: 'List all user session' })
  @ApiQuery({ name: 'option', type: QueryOptionDto, required: false })
  list(@QueryOption() option) {
    return this.usService.list(option);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get session by user id' })
  get(@Param('id') id) {
    return this.usService.get(id).then(res => {
      if (!res) {
        throw new NotFoundException('Not Found User Session');
      }
      return res;
    });
  }

  @Post()
  @ApiOperation({ summary: 'Update or create user session' })
  save(
    @AuthUser() authUser: AuthUserInterface,
    @Body() body: UpdateUserSessionDto,
  ) {
    return this.usService.create(authUser, body);
  }
}
