import { UserSessionService } from '@backend/features/user-session/user-session.service';
import { AuthUser } from '@backend/interfaces/auth-user.interface';
import { UserSessionStatusType } from '@backend/typeorm/user-session.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionService {
  constructor(private readonly usService: UserSessionService) {}

  static isValidUserStatus(status: UserSessionStatusType | string) {
    return UserSessionService.isValidUserStatus(status);
  }

  get(userId: number) {
    return this.usService.get(userId);
  }

  updateStatus(authUser: AuthUser, status: UserSessionStatusType) {
    return this.usService.updateStatus(authUser, status);
  }
}
