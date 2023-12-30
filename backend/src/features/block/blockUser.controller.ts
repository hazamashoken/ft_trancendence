import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BlockService } from './blockUser.service';
import { User } from '@backend/typeorm';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { BlockUserDto } from './dto/BlockUser.dto';
import { AuthGuard } from '@backend/shared/auth.guard';
import { XKeyGuard } from '@backend/shared/x-key.guard';
import { AuthUser } from '@backend/pipe/auth-user.decorator';
import { AuthUser as AuthUserInterface } from '@backend/interfaces/auth-user.interface';

@Controller('user')
@UseGuards(XKeyGuard, AuthGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiTags('BlockUser')
export class BlockUserController {
  constructor(private readonly blockService: BlockService) {}

  @Get(':userId/block')
  async getAllBlockedUsers(
    @AuthUser() authUser: AuthUserInterface,
    @Param('userId') userId: number,
  ): Promise<User[]> {
    return await this.blockService.getAllBlockedUsers(authUser.user.id);
  }

  @Post(':userId/block')
  @ApiOperation({ summary: 'Block user' })
  async blockUser(
    @Param('userId') userId: number,
    @AuthUser() authUser: AuthUserInterface,
    @Body() dto: BlockUserDto,
  ): Promise<User[]> {
    if (authUser.user.id == dto.userId) {
      throw new Error('You cannot block yourself');
    }
    return await this.blockService.blockUser(authUser.user.id, dto.userId);
  }

  @Post(':userId/unblock')
  async unblockUser(
    @Param('userId') userId: number,
    @AuthUser() authUser: AuthUserInterface,
    @Body() dto: BlockUserDto,
  ): Promise<User[]> {
    if (authUser.user.id == dto.userId) {
      throw new Error('You cannot unblock yourself');
    }
    return await this.blockService.unBlockUser(userId, dto.userId);
  }
}
