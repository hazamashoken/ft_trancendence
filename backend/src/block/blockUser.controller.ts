import { Body, Controller, Get, Param, Post, Delete } from "@nestjs/common";
import { BlockService } from "./blockUser.service";
import { User } from "@backend/typeorm";

@Controller('blockUser')
export class BlockUserController {
  constructor (
    private readonly blockService: BlockService
  ){};

  @Get(':userId')
  async getAllBlockedUsers(
    @Param('userId') userId: number,
  ): Promise<User[]> {
    return await this.blockService.getAllBlockedUsers(userId);
  }

  @Post()
  async blockUser(
    @Body() dto: {myId: number,userId: number }
  ): Promise<User[]> {
    return await this.blockService.blockUser(dto.myId, dto.userId);
  }

  @Delete()
  async unblockUser(
    @Body() dto: {myId: number,userId: number }
  ): Promise<User[]> {
    return await this.blockService.unBlockUser(dto.myId, dto.userId);
  }
}