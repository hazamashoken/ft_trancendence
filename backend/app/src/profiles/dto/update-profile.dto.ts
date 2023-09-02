import { IsEmpty } from 'class-validator';

// Detect only forbidden field
export class UpdateUserDto {
  @IsEmpty()
  intraId: number;

  @IsEmpty()
  id: number;
}
