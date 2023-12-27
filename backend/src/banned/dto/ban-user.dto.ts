import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BanUserDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  userId: number;

  @IsString()
  @ApiProperty({ nullable: true, default: 'wtf' })
  reason: string;
}
