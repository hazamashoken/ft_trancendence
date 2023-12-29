import { User } from '@backend/typeorm';
import { Exclude } from 'class-transformer';
import { IsEmpty, IsString } from 'class-validator';

export class ChatUserDto extends User{
  @IsString()
  role: string;
}
