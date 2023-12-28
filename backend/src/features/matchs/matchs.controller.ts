import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatchsService } from './matchs.service';
import { CreateMatchsDto } from './dto/create-matchs.dto';
import { UpdateMatchsDto } from './dto/update-matchs.dto';
import { ParseIntPipe } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { QueryOption } from '@backend/pipe/query-option.decorator';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiSecurity, ApiTags, } from '@nestjs/swagger';
import { AuthGuard } from '@backend/shared/auth.guard';
import { XKeyGuard } from '@backend/shared/x-key.guard';
import { UseGuards } from '@nestjs/common';
import { QueryOptionDto } from '@backend/dto/query-option.dto';

// @UseGuards(XKeyGuard, AuthGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiTags('Match')
@Controller('matchs')
export class MatchsController {
  constructor(private readonly matchService: MatchsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a game match by body proviced.' })
  async createMatch(@Body() createMatchsDto: CreateMatchsDto) {
    await this.matchService.createMatch(createMatchsDto);
  }
  
  @Get('test/:num')
  testFunction(@Param('num') num: number) {
    if (num === 1) {
      // * async createNewMatch(player1Id: number): Promise<number>
      return this.matchService.createNewMatch(5);
    } else if (num === 2) {
      // * async updateStatus(matchId: number, status: matchStatus): Promise<boolean>
      return this.matchService.updateStatus(3, 'FINISHED');
    } else {
      //* async updateMatch(
      //* matchId: number, player2Id: number, player1Point: number, player2Point: number, status?: matchStatus): Promise<boolean> 
      // return this.matchService.updateMatch()
    }
  }

  @Get()
  @ApiOperation({ summary: 'List all friendship record with query filter' })
  @ApiQuery({ name: 'playerId', type: Number, required: false })
  @ApiQuery({ name: 'matchId', type: Number, required: false})
  @ApiQuery({ name: 'option', type: QueryOptionDto, required: false })
  getAll(
    @Query('playerId') playerId,
    @Query('matchId') matchId,
    @QueryOption() option 
  ) {
    return this.matchService.findAll(playerId, matchId, option);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get a game match by match Id.' })
  @ApiParam({ name: 'id', type: Number, example: 4242 })
  getAMatchById(@Param('id', ParseIntPipe) id: string) {
    return this.matchService.findAMatchById(+id);
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'list all of match by user Id.' })
  @ApiParam({ name: 'id', type: Number, example: 42 })
  getMatchsByUser(@Param('id', ParseIntPipe) id: string) {
    return this.matchService.findMatchsByUser(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update some property of a game match by match Id and body provided.' })
  @ApiParam({ name: 'id', type: Number, example: 4242 })
  async updateMatchProperty(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchsDto) {
    await this.matchService.updateMatchProperty(+id, updateMatchDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a game match by match Id.' })
  @ApiParam({ name: 'id', type: Number, example: 4242 })
  async removeMatchById(@Param('id') id: string) {
    await this.matchService.removeMatchById(+id);
  }
}
