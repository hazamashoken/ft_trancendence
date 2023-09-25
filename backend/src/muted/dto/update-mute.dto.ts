import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateMuteDto {
  @ApiProperty()
  @IsNumber()
  muteId: number;

  @ApiProperty()
  mutedUntil?: Date | null;
}
