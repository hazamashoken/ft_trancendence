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
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  SaveFriendshipDto,
  SaveFriendshipUsernameDto,
} from './dto/save-friendship.dto';
import { FriendshipService } from './friendship.service';
import { FriendshipStatus } from '@backend/typeorm/friendship.entity';
import { QueryOption } from '@backend/pipe/query-option.decorator';
import { QueryOptionDto } from '@backend/dto/query-option.dto';
import { UserService } from '@backend/features/user/user.service';

@Controller('me/friends')
@UseGuards(XKeyGuard, AuthGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiTags('Me')
export class FriendsController {
  constructor(private readonly fsService: FriendshipService) {}

  @Get()
  @ApiOperation({ summary: 'list all friend request by user auth' })
  @ApiQuery({
    name: 'status',
    enum: ['REQUESTED', 'WAITING', 'ACCEPTED'],
    required: false,
  }) // eslint-disable-line prettier/prettier
  @ApiQuery({ name: 'option', type: QueryOptionDto, required: false })
  list(
    @AuthUser() authUser: AuthUserInterface,
    @Query('status') status: FriendshipStatus,
    @QueryOption() option,
  ) {
    if (status && !FriendshipService.isValidStatus(status)) {
      throw new BadRequestException(
        'Friend status is not valid, REQUESTED or WATING or ACCPETED',
      );
    }
    if (!authUser.user) {
      throw new UnauthorizedException('User has not created.');
    }
    return this.fsService.list(authUser.user.id, status, option);
  }

  @Post('request')
  @ApiOperation({ summary: 'send friend request to other user' })
  request(
    @AuthUser() authUser: AuthUserInterface,
    @Body() body: SaveFriendshipDto,
  ) {
    return this.fsService.request(authUser.user.id, body.userId);
  }

  @Post('request-username/')
  @ApiOperation({ summary: 'send friend request to other user' })
  request_user(
    @AuthUser() authUser: AuthUserInterface,
    @Body() body: SaveFriendshipUsernameDto,
  ) {
    return this.fsService.request_user(authUser.user.id, body.username);
  }

  @Put('accept')
  @ApiOperation({ summary: 'accept friend request from other user' })
  accept(
    @AuthUser() authUser: AuthUserInterface,
    @Body() body: SaveFriendshipDto,
  ) {
    return this.fsService.accept(authUser.user.id, body.userId);
  }

  @Delete('remove')
  @ApiOperation({ summary: 'accept friend request from other user' })
  remove(
    @AuthUser() authUser: AuthUserInterface,
    @Body() body: SaveFriendshipDto,
  ) {
    return this.fsService.remove(authUser.user.id, body.userId);
  }
}
