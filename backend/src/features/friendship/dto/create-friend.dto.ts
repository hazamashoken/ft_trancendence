import { FriendshipStatus } from '@backend/typeorm/friendship.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class CreateFriendDto {
  @IsNumber()
  @ApiProperty({ example: '2' })
  friendId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: '1' })
  userId: number;

  @IsIn(['REQUESTED', 'ACCEPTED'])
  @ApiProperty({ example: 'REQUESTED' })
  status: FriendshipStatus;
}
