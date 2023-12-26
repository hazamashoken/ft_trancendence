import { User } from '@backend/typeorm';

export class ReturnMessageDto {
  massageId: number;

  message: string;

  athor: User;

  createAt: Date;

  updateAt: Date;

  my: string;

  hm: string;
}
