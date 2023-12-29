import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber } from 'class-validator';

export class CreateMuteDto {
  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNumber()
  mutedById: number;

  @ApiProperty()
  // @IsDate()
  mutedUntil?: Date | null;
}
