import { User } from '@backend/typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmpty, IsOptional, IsString } from 'class-validator';

export class ChatUserDto extends User{
  @ApiProperty()
  @IsString()
  @IsOptional()
  role: string;
}
