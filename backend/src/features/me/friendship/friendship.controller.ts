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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { FriendsService } from './friendship.service';
import { RequestFriendDto } from './dto/update-friend.dto';

@Controller('me/friends')
@UseGuards(XKeyGuard, AuthGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiTags('Me')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  @ApiOperation({ summary: 'list all friend request by user auth' })
  list(@AuthUser() authUser: AuthUserInterface, @Query('status') status) {
    console.log(status);
    if (status && !FriendsService.isValidStatus(status)) {
      throw new BadRequestException(
        'Friend status is not valid, REQUESTED or  ACCPETED',
      );
    }
    return this.friendsService.list(authUser.user.id);
  }

  @Post('request')
  @ApiOperation({ summary: 'send friend request to other user' })
  request(
    @AuthUser() authUser: AuthUserInterface,
    @Body() body: RequestFriendDto,
  ) {
    console.log(body);
    return 'Test post request';
  }

  @Post('accept')
  @ApiOperation({ summary: 'accept friend request from other user' })
  accept(@AuthUser() authUser: AuthUserInterface, @Body() body) {
    return 'Test post accept';
  }

  @Get(':id')
  get(@AuthUser() authUser: AuthUserInterface, @Param('id') id) {
    if (isNaN(id)) {
      throw new BadRequestException('Invalid ID is not number');
    }
    return this.friendsService.get(+id);
  }

  @Delete(':id')
  remove(@AuthUser() authUser: AuthUserInterface) {}
}
