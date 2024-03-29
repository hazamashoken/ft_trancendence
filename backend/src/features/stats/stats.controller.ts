import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StatsService } from './stats.service';
import { CreateStatsDto } from './dto/create-stats.dto';
import { UpdateStatsDto } from './dto/update-stats.dto';
import { ParseIntPipe } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { QueryOption } from '@backend/pipe/query-option.decorator';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@backend/shared/auth.guard';
import { XKeyGuard } from '@backend/shared/x-key.guard';
import { UseGuards } from '@nestjs/common';
import { QueryOptionDto } from '@backend/dto/query-option.dto';
import { Stats } from '@backend/typeorm';
import { stat } from 'fs';
import { AuthUser } from '@backend/pipe/auth-user.decorator';
import { AuthUser as AuthUserInterface } from '@backend/interfaces/auth-user.interface';

@UseGuards(XKeyGuard, AuthGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('me')
  @ApiOkResponse({
    type: Stats,
    description: 'Success to get stats by user id.',
  })
  async getMeStats(@AuthUser() authUser: AuthUserInterface) {
    return await this.statsService.findStatsByUser(authUser.user.id);
  }

  @ApiOperation({
    summary:
      'create a new stats with defualt value (win=0,lose=0,point=1000) by input user id.',
  })
  @Post()
  async createNewStats(@AuthUser() authUser: AuthUserInterface) {
    await this.statsService.createNewStats(authUser.user.id);
  }

  @ApiOperation({ summary: 'list all stats in database.' })
  @Get()
  listAllStats() {
    return this.statsService.listAllStats();
  }

  @ApiOperation({
    summary: 'list all stats in database in descent order base on point.',
  })
  @Get('rank')
  listAllStatsInOrder() {
    return this.statsService.listAllStatsInDescOrder();
  }

  @ApiOperation({ summary: 'get a stat by user id.' })
  @ApiParam({ name: 'id', type: Number, example: 4242 })
  @Get(':id')
  async findStatsByUser(@Param('id', ParseIntPipe) id: number) {
    const stats: Partial<Stats> = await this.statsService.findStatsByUser(+id);
    if (!stats) {
      console.log(`[Debug]::statsIsNull|${stats}|`);
      return this.statsService.mockUpDefualtStats();
    }
    return stats;
  }

  @ApiOperation({
    summary:
      'list stats in database in descent order baes on point with limit data.',
  })
  @ApiParam({ name: 'num', type: Number, example: 4242 })
  @Get('rank/:num')
  listStatsInRankNumber(@Param('num', ParseIntPipe) num: number) {
    return this.statsService.listStatsInDescOederLimit(num);
  }

  @ApiOperation({ summary: 'update stats by user id.' })
  @ApiParam({ name: 'id', type: Number, example: 4242 })
  @Patch(':id')
  async updateStatsByUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatsDto: UpdateStatsDto,
  ) {
    await this.statsService.updateStatsByUser(+id, updateStatsDto);
  }

  @ApiOperation({ summary: 'delete all match.' })
  @Delete('all')
  async removeStatsAll() {
    await this.statsService.removeAllStats();
  }

  @ApiOperation({ summary: 'delete a match by user id.' })
  @ApiParam({ name: 'id', type: Number, example: 4242 })
  @Delete(':id')
  async removeStatsByUser(@Param('id', ParseIntPipe) id: number) {
    await this.statsService.removeStatsByUser(+id);
  }
}
