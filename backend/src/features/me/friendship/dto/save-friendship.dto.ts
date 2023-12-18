import { IsNumber } from 'class-validator';

// Detect only forbidden field
export class SaveFriendshipDto {
  @IsNumber()
  userId: number;
}
