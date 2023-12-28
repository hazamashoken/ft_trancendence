import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

// Detect only forbidden field
export class SaveFriendshipDto {
  @ApiProperty({ description: 'user id' })
  @IsNumber()
  userId: number;
}
