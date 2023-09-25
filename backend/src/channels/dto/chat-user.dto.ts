import { Exclude } from 'class-transformer';
import { IsEmpty } from 'class-validator';

export class ChatUserDto {
  @IsEmpty()
  id: number;

  @IsEmpty()
  intraId: number;

  @IsEmpty()
  firstName: string;
}
