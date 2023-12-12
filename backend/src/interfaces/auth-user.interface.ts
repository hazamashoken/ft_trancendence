import { User } from '@backend/typeorm';
import { FtUser } from './ft-user.interface';

export interface AuthUser {
  ft: FtUser;
  user: User;
  accessToken: string;
}
