import { IsEmpty } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

// Detect only forbidden field
export class SaveUserDto extends CreateUserDto {
  @IsEmpty()
  intraId: number;

  @IsEmpty()
  id: number;
}
