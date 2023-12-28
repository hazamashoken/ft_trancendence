import { IsNumber, Max, Min, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { matchStatus } from '@backend/typeorm/match.entity';

// TODO ask Andre about max score
export class CreateMatchsDto {
  @IsNumber()
  @ApiProperty()
  player1Id: number;
  
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  player2Id: number;
  
  @IsNumber()
  @Min(0)
  @Max(15)
  @IsOptional()
  @ApiProperty()
  player1Point: number;
  
  @IsNumber()
  @Min(0)
  @Max(15)
  @IsOptional()
  @ApiProperty()
  player2Point: number;

  @IsIn(['WAITING', 'PLAYING', 'FINISHED'])
  @IsOptional()
  @ApiProperty()
  status: matchStatus
}
