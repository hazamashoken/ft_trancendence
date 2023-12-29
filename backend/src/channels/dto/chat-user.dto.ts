import { User } from '@backend/typeorm';
import { Exclude } from 'class-transformer';
import { IsEmpty, IsOptional, IsString } from 'class-validator';

export class ChatUserDto extends User{
  @IsString()
  @IsOptional()
  role: string;
}
