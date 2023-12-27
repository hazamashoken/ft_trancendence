import { Body, Controller, Get, Param, Post, Delete } from "@nestjs/common";
import { BlockService } from "./blockUser.service";
import { User } from "@backend/typeorm";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { BlockUserDto, intraD } from "./dto/BlockUser.dto";

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

  @Post('/block')
  @ApiOperation({ summary: 'Block user' })
  async blockUser(
    @Body() dto: BlockUserDto
  ): Promise<User[]> {
    return await this.blockService.blockUser(dto.myId, dto.id);
  }

  @Post('/unblock')
  async unblockUser(
    @Body() dto: BlockUserDto
  ): Promise<User[]> {
    return await this.blockService.unBlockUser(dto.myId, dto.id);
  }

  @Get('/getUserByIntrId/:intraId')
  async getUserByIntraId(@Param('intraId') intraId: number): Promise<intraD> {
    return await this.blockService.getUserByIntraId(intraId);
  }
}