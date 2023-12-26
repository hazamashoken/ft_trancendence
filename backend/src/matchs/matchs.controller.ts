import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatchsService } from './matchs.service';
import { CreateMatchsDto } from './dto/create-matchs.dto';
import { UpdateMatchsDto } from './dto/update-matchs.dto';
import { ParseIntPipe } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { QueryOption } from '@backend/pipe/query-option.decorator';

@Controller('matchs')
export class MatchsController {
  constructor(private readonly matchService: MatchsService) {}

  @Post()
  async createMatch(@Body() createMatchsDto: CreateMatchsDto) {
    await this.matchService.createMatch(createMatchsDto);
    return 'Succesful! the new match was added.';
  }

  @Get()
  getAll(
    @Query('playerId') playerId,
    @Query('matchId') matchId,
    @QueryOption() option 
  ) {
    return this.matchService.findAll(playerId, matchId, option);
  }

  @Get(':id')
  getAMatchById(@Param('id', ParseIntPipe) id: number) {
    return this.matchService.findAMatchById(+id);
  }

  @Get('user/:id')
  getMatchsByUser(@Param('id', ParseIntPipe) id: number) {
    return this.matchService.findMatchsByUser(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchsDto) {
    await this.matchService.update(+id, updateMatchDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.matchService.removeMatchById(+id);
  }
}
