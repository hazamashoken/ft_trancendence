import { AuthUser } from '@backend/pipe/auth-user.decorator';
import { AuthUser as AuthUserInterface } from '@backend/interfaces/auth-user.interface';
import { AuthGuard } from '@backend/shared/auth.guard';
import { XKeyGuard } from '@backend/shared/x-key.guard';
import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Query, UseGuards } from '@nestjs/common';
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
  list(@AuthUser() authUser: AuthUserInterface, @Query('status') status) {
    console.log(status);
    if (status && !FriendsService.isValidStatus(status)) {
      throw new BadRequestException('Friend status is not valid, REQUESTED or  ACCPETED');
    }
    return this.friendsService.list(authUser.user.id);
  }



  @Post('request')
  request(@AuthUser() authUser: AuthUserInterface, @Body() body) {

  };

  @Post('accept')
  accept() {

  }

  @Get(':id')
  get(@AuthUser() authUser: AuthUserInterface, @Param('id') id) {
    if (isNaN(id)) {
      throw new BadRequestException('Invalid ID is not number');
    }
    return this.friendsService.get(+id);
  }

  @Delete(':id')
  remove(@AuthUser() authUser: AuthUserInterface) {

  }
}
