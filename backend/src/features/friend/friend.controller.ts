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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreateFriendDto } from './dto/create-friend.dto';
import { FriendService } from './friend.service';

@Controller('friends')
@UseGuards(XKeyGuard, AuthGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiTags('Friends')
export class FriendsController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  list(@Query('user_id') userId) {
    console.log(userId);
    return userId;
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
    if (!FriendService.isValidStatus(body.status)) {
      throw new BadRequestException(
        'FriendStatus is not valid, REQUESTED or ACCEPTED',
      );
    }
    return this.friendService.create(body.userId, body.friendId, body.status);
  }
}
