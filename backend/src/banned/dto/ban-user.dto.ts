import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BanUserDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  chatId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  adminId: number;
  
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  bannedUser: number;

  @IsString()
  @ApiProperty({ nullable: true, default: 'wtf' })
  banReason: string;
}
