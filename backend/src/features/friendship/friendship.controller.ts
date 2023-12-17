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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CreateFriendDto } from './dto/create-friend.dto';
import { FriendshipService } from './friendship.service';
import { QueryOption } from '@backend/pipe/query-option.decorator';
import { QueryOptionDto } from '@backend/dto/query-option.dto';

@Controller('friendships')
@UseGuards(XKeyGuard, AuthGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiTags('Friendship')
export class FriendsController {
  constructor(private readonly fsService: FriendshipService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get friendship record by id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  get(@Param('id') id) {
    return this.fsService.get(id).then(res => {
      if (!res) {
        throw new NotFoundException();
      }
      return res;
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete friendship record by id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  delete(@Param('id') id) {
    return this.fsService.delete(id);
  }

  @Get()
  @ApiOperation({ summary: 'List all friendship record with query filter' })
  @ApiQuery({ name: 'userId', type: Number, required: false })
  @ApiQuery({ name: 'status', enum: ['REQUESTED', 'ACCEPTED'], required: false}) // eslint-disable-line prettier/prettier
  @ApiQuery({ name: 'option', type: QueryOptionDto, required: false })
  list(
    @Query('userId') userId,
    @Query('status') status,
    @QueryOption() option,
  ) {
    return this.fsService.list(userId, status, option);
  }

  @Post()
  @ApiOperation({ summary: 'Create friendship relation with status `REQUESTED` or `ACCEPTED`' }) // eslint-disable-line prettier/prettier
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
