import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { AccountController } from './account/account.controller';
import { SharedModule } from '@backend/shared/shared.module';
import { AccountService } from './account/account.service';
import { FriendsController } from './friendship/friendship.controller';
import { SecurityController } from './security/security.controller';
import { SecurityService } from './security/security.service';
import { FriendshipModule } from '../friendship/friendship.module';
import { FriendshipService } from './friendship/friendship.service';
import { UserSessionModule } from '../user-session/user-session.module';
import { SessionService } from './session/session.service';
import { SessionController } from './session/session.controller';

@Module({
  controllers: [
    AccountController,
    SecurityController,
    FriendsController,
    SessionController,
  ],
  providers: [
    AccountService,
    SecurityService,
    FriendshipService,
    SessionService,
  ],
  imports: [
    UserModule,
    FriendshipModule,
    AuthModule,
    SharedModule,
    UserSessionModule,
  ],
  exports: [MeModule],
})
export class MeModule {}
