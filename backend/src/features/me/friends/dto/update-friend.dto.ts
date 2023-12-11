import { IsNumberString } from 'class-validator';

// Detect only forbidden field
export class RequestFriendDto {
  @IsNumberString()
  userId: number;
}
