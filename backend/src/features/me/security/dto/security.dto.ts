import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

// Detect only forbidden field
export class CodeDto {
  @ApiProperty({ description: 'otop code' })
  @IsString()
  code: string;
}

export class SaveFriendshipUsernameDto {
  @ApiProperty({ description: 'username' })
  @IsString()
  username: string;
}
