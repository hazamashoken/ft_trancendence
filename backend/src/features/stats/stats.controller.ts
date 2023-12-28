import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StatsService } from './stats.service';
import { CreateStatsDto } from './dto/create-stats.dto';
import { UpdateStatsDto } from './dto/update-stats.dto';
import { ParseIntPipe } from '@nestjs/common';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Post()
  async createNewStats(@Body() createStatsDto: CreateStatsDto) {
    await this.statsService.createNewStats(createStatsDto);
  }

  @Get()
  listAllStats() {
    return this.statsService.listAllStats();
  }

  @Get('rank')
  listAllStatsInOrder() {
    return this.statsService.listAllStatsInDescOrder();
  }

  @Get(':id')
  findStatsByUser(@Param('id', ParseIntPipe) id: number) {
    return this.statsService.findStatsByUser(+id);
  }

  @Get('rank/:num')
  listStatsInRankNumber(@Param('num', ParseIntPipe) num: number) {
    return this.statsService.listStatsInDescOederLimit(num);
  }

  @Patch(':id')
  async updateStatsByUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatsDto: UpdateStatsDto
  ) {
    await this.statsService.updateStatsByUser(+id, updateStatsDto);
  }

  @Delete(':id')
  async removeStatsByUser(@Param('id', ParseIntPipe) id: number) {
    await this.statsService.removeStatsByUser(+id);
  }
}
