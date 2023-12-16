import { AuthUser } from '@backend/pipe/auth-user.decorator';
import { AuthUser as AuthUserInterface } from '@backend/interfaces/auth-user.interface';
import { AuthGuard } from '@backend/shared/auth.guard';
import { XKeyGuard } from '@backend/shared/x-key.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreateFriendDto } from './dto/create-friend.dto';
import { FriendshipService } from './friendship.service';

@Controller('friends')
@UseGuards(XKeyGuard, AuthGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiTags('Friends')
export class FriendsController {
  constructor(private readonly fsService: FriendshipService) {}

  @Get()
  list(@Query('userId') userId, @Query('status') status) {
    return this.fsService.findAll(userId, status);
  }

  @Post()
  create(
    @AuthUser() authUser: AuthUserInterface,
    @Body() body: CreateFriendDto,
  ) {
    if (!body.userId) {
      if (!authUser.user) {
        throw new BadRequestException("AuthUser hasn't register yet.");
      }
      body.userId = authUser.user.id;
    }
    if (!FriendshipService.isValidStatus(body.status)) {
      throw new BadRequestException(
        'FriendshipStatus is not valid, REQUESTED or ACCEPTED',
      );
    }
    return this.fsService.create(body.userId, body.friendId, body.status);
  }

  @Delete()
  removeFriendship() {

  }
}
