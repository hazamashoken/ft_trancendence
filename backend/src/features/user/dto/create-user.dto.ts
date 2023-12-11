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
  @ApiProperty()
  lastName: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty()
  email: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty()
  imageUrl: string;
}
