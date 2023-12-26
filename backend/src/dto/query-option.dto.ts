import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class QueryOptionDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'select some field use `.` for sub projection table.',
    example: 'id, createdAt',
    required: false,
  })
  fields: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'limit query result',
    example: 1,
    required: false,
  })
  limit: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'pagination offset row',
    example: 1,
    required: false,
  })
  offset: number;
}
