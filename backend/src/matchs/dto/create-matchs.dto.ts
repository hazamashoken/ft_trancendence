import { IsNumber, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// TODO ask Andre about max score
export class CreateMatchsDto {
  @IsNumber()
  @ApiProperty()
  player1Id: number;
  
  @IsNumber()
  @ApiProperty()
  player2Id: number;
  
  @IsNumber()
  @ApiProperty()
  @Min(0)
  @Max(15)
  player1Point: number;
  
  @IsNumber()
  @ApiProperty()
  @Min(0)
  @Max(15)
  player2Point: number;
}
