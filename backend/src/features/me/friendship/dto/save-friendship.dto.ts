import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

// Detect only forbidden field
export class SaveFriendshipDto {
  @ApiProperty({ description: 'user id' })
  @IsNumber()
  userId: number;
}

export class SaveFriendshipUsernameDto {
  @ApiProperty({ description: 'username' })
  @IsString()
  username: string;
}
