import { AuthGuard } from '@backend/shared/auth.guard';
import { XKeyGuard } from '@backend/shared/x-key.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FriendsService } from './friends.service';

@Controller('me/friends')
@UseGuards(XKeyGuard, AuthGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiTags('Me')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  list() {
    return [];
  }
}
