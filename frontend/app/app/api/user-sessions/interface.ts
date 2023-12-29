import { User } from "../me/interfaces";

export interface UserSessionInterface {
  id: number;
  status: 'ONLINE' | 'IN_GAME' | 'OFFLINE';
  accessToken?: string;
  user: User;
}