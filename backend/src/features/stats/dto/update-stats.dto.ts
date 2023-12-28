import { IsNumber, IsPositive, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export class UpdateStatsDto {
  @IsNumber()
  // @IsPositive()
  @Min(0)
  @IsOptional()
  @ApiProperty()
  win: number;
  
  @IsNumber()
  // @IsPositive()
  @Min(0)
  @IsOptional()
  @ApiProperty()
  lose: number;
  
  @IsNumber()
  // @IsPositive()
  @Min(0)
  @IsOptional()
  @ApiProperty()
  point: number;
}
