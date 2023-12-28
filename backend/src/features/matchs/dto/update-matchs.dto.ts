import { IsNumber, Max, Min, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { matchStatus } from '@backend/typeorm/match.entity';

export class UpdateMatchsDto {
  @IsNumber()
  @ApiProperty()
  @IsOptional()
  player1Id: number;
  
  @IsNumber()
  @ApiProperty()
  @IsOptional()
  player2Id: number;
  
  @IsNumber()
  @ApiProperty()
  @Min(0)
  @Max(15)
  @IsOptional()
  player1Point: number;
  
  @IsNumber()
  @ApiProperty()
  @Min(0)
  @Max(15)
  @IsOptional()
  player2Point: number;

  @IsIn(['WAITING', 'PLAYING', 'FINISHED'])
  @IsOptional()
  @ApiProperty()
  status: matchStatus
}
