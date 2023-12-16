import { FriendStatus } from '@backend/typeorm/friend.entity';
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

  @IsIn(['REQUESTED', 'ACCETPED'])
  @ApiProperty({ example: 'REQUESTED' })
  status: FriendStatus;
}
