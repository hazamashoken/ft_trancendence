import { User } from '@backend/typeorm';

export class ReturnMessageDto {
  massageId: number;

  message: string;

  athor: User;

  my: string;

  hm: string;
}
