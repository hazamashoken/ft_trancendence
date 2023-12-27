import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StatsService } from './stats.service';
import { CreateStatsDto } from './dto/create-stats.dto';
import { UpdateStatsDto } from './dto/update-stats.dto';

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

  @Get(':id')
  findStatsByUser(@Param('id') id: string) {
    return this.statsService.findStatsByUser(+id);
  }

  @Patch(':id')
  async updateStatsByUser(@Param('id') id: string, @Body() updateStatsDto: UpdateStatsDto) {
    await this.statsService.updateStatsByUser(+id, updateStatsDto);
  }

  @Delete(':id')
  async removeStatsByUser(@Param('id') id: string) {
    await this.statsService.removeStatsByUser(+id);
  }
}
