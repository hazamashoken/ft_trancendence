import { IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { POINT_DEFAULT } from '@backend/typeorm/stats.entity';

export class CreateStatsDto {
  @IsNumber()
  @ApiProperty({
    description: 'id of the user that want to create the stats data.',
    required: true,
  })
  userId: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'number of the match that user win the game.',
    minimum: 0,
    default: 0,
    required: false,
  })
  @IsOptional()
  win: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'number of the match that user lose the game.',
    minimum: 0,
    default: 0,
    required: false,
  })
  @IsOptional()
  lose: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    description:
      'the point that acquire win/lose match, this will use to calulate the rank of user.',
    minimum: 0,
    default: POINT_DEFAULT,
    required: false,
  })
  @IsOptional()
  point: number;
}
