import { Body, Controller, Get, Param, Post, Delete } from "@nestjs/common";
import { BlockService } from "./blockUser.service";
import { User } from "@backend/typeorm";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { BlockUserDto } from "./dto/BlockUser.dto";

@Controller('user')
@ApiTags('BlockUser')
export class BlockUserController {
  constructor(
    private readonly blockService: BlockService
  ) { };

  @Get(':userId/block')
  async getAllBlockedUsers(
    @Param('userId') userId: number,
  ): Promise<User[]> {
    return await this.blockService.getAllBlockedUsers(userId);
  }

  @Post(':userId/block')
  @ApiOperation({ summary: 'Block user' })
  async blockUser(
    @Param('userId') userId: number,
    @Body() dto: BlockUserDto
  ): Promise<User[]> {
    return await this.blockService.blockUser(userId, dto.userId);
  }

  @Post(':userId/unblock')
  async unblockUser(
    @Param('userId') userId: number,
    @Body() dto: BlockUserDto
  ): Promise<User[]> {
    return await this.blockService.unBlockUser(userId, dto.userId);
  }
}