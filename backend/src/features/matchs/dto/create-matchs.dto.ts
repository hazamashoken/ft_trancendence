import { IsNumber, Max, Min, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MatchStatus } from '@backend/typeorm/match.entity';

// TODO ask Andre about max score
export class CreateMatchsDto {
  @IsNumber()
  @ApiProperty({
    description: 'id of the user who own the match (player1).',
    required: true,
  })
  player1Id: number;
  
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'id of the user who join the match (player2).',
    required: false,
  })
  player2Id: number;
  
  @IsNumber()
  @Min(0)
  @Max(15)
  @IsOptional()
  @ApiProperty({
    description: 'point of user who own the match (player1).',
    minimum: 0,
    default: 0,
    required: false,
  })
  player1Point: number;
  
  @IsNumber()
  @Min(0)
  @Max(15)
  @IsOptional()
  @ApiProperty({
    description: 'point of user who join the match (player2).',
    minimum: 0,
    default: 0,
    required: false,
  })
  player2Point: number;

  @IsIn(['WAITING', 'PLAYING', 'FINISHED'])
  @IsOptional()
  @ApiProperty({
    description: 'the stats of the match [ \'WAITING\', \'PLAYING\', \'FINISHED\'].',
    required: false,
  })
  status: MatchStatus
}
