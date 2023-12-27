import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class dmCreate{
  @ApiProperty()
  @IsNumber()
  user1: number;

  @ApiProperty()
  @IsNumber()
  user2: number;
}