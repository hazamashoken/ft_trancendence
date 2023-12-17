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
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreateFriendDto } from './dto/create-friend.dto';
import { FriendshipService } from './friendship.service';
import { QueryOption } from '@backend/pipe/query-option.decorator';

@Controller('friendships')
@UseGuards(XKeyGuard, AuthGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiTags('Friendship')
export class FriendsController {
  constructor(private readonly fsService: FriendshipService) { }

  @Get(':id')
  get(@Param('id') id) {
    return this.fsService.get(id).then(res => {
      if (!res) {
        throw new NotFoundException();
      }
      return res;
    });
  }

  @Delete(':id')
  delete(@Param('id') id) {
    return this.fsService.delete(id);
  }

  @Get()
  list(
    @Query('userId') userId,
    @Query('status') status,
    @QueryOption() option,
  ) {
    return this.fsService.list(userId, status, option);
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
}
