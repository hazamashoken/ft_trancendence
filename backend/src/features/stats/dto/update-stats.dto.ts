import { IsNumber, IsPositive, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
import { POINT_DEFAULT } from '@backend/typeorm/stats.entity';

export class UpdateStatsDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({
    description: 'number of the match that user win the game.',
    minimum: 0,
    default: 0,
    required: false,
  })
  win: number;
  
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({
    description: 'number of the match that user lose the game.',
    minimum: 0,
    default: 0,
    required: false,
  })
  lose: number;
  
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({
    description: 'the point that acquire win/lose match, this will use to calulate the rank of user.',
    minimum: 0,
    default: POINT_DEFAULT,
    required: false,
  })
  point: number;
}
