import { User } from '@backend/typeorm';

export class ReturnMessageDto {
  massageId: number;

  message: string;

  athor: User;

  createAt: Date;

  updateAt: Date;
}

export interface Cursor {
  beforeCursor: string | null;
  afterCursor: string | null;
}

export class ReturnCursorMessageDto {
  data: ReturnMessageDto[];
  cursor: Cursor;
}
