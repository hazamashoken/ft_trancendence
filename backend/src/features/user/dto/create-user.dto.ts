import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 171793 })
  intraId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'tester' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'nestjs' })
  lastName: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'tester@student.42.bangkok.com' })
  email: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty()
  imageUrl: string;
}
