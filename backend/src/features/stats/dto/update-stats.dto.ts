import { IsNumber, IsPositive, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export class UpdateStatsDto {
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  @IsOptional()
  win: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  @IsOptional()
  lose: number;
  
  @IsNumber()
  @ApiProperty()
  @IsPositive()
  @IsOptional()
  point: number;
}
