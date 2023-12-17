import { IsNumberString } from 'class-validator';

// Detect only forbidden field
export class SaveFriendshipDto {
  @IsNumberString()
  userId: number;
}
