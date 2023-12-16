import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { AccountController } from './account/account.controller';
import { SharedModule } from '@backend/shared/shared.module';
import { AccountService } from './account/account.service';
import { FriendsService } from './friendship/friendship.service';
import { FriendsController } from './friendship/friendship.controller';
import { SecurityController } from './security/security.controller';
import { SecurityService } from './security/security.service';
import { FriendshipModule } from '../friendship/friendship.module';

@Module({
  controllers: [AccountController, SecurityController, FriendsController],
  providers: [AccountService, SecurityService, FriendsService],
  imports: [UserModule, FriendshipModule, AuthModule, SharedModule],
  exports: [MeModule],
})
export class MeModule {}
