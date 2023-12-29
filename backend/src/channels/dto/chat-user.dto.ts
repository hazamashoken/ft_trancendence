import { Exclude } from 'class-transformer';
import { IsEmpty, IsOptional, IsString } from 'class-validator';

export class ChatUserDto {
  @IsEmpty()
  id: number;

  @IsEmpty()
  intraId: number;

  @IsEmpty()
  firstName: string;

  @IsOptional()
  @IsString()
  role: string;
}
