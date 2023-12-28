import { IsNumber, Max, Min, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MatchStatus } from '@backend/typeorm/match.entity';

export class UpdateMatchsDto {
  @IsNumber()
  @ApiProperty({
    description: 'id of the user who own the match (player1).',
    required: true,
  })
  @IsOptional()
  player1Id: number;
  
  @IsNumber()
  @ApiProperty()
  @ApiProperty({
    description: 'id of the user who join the match (player2).',
    required: false,
  })
  player2Id: number;
  
  @IsNumber()
  @ApiProperty({
    description: 'point of user who own the match (player1).',
    minimum: 0,
    default: 0,
    required: false,
  })
  @Min(0)
  @Max(15)
  @IsOptional()
  player1Point: number;
  
  @IsNumber()
  @ApiProperty({
    description: 'point of user who join the match (player2).',
    minimum: 0,
    default: 0,
    required: false,
  })
  @Min(0)
  @Max(15)
  @IsOptional()
  player2Point: number;

  @IsIn(['WAITING', 'PLAYING', 'FINISHED'])
  @IsOptional()
  @ApiProperty({
    description: 'the stats of the match [ \'WAITING\', \'PLAYING\', \'FINISHED\'].',
    required: false,
  })
  status: MatchStatus
}
