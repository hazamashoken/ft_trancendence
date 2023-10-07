import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { AccountController } from './account/account.controller';
import { SharedModule } from '@backend/shared/shared.module';
import { AccountService } from './account/account.service';
import { FriendsService } from './friends/friends.service';
import { FriendsController } from './friends/friends.controller';

@Module({
  controllers: [AccountController, FriendsController],
  providers: [AccountService, FriendsService],
  imports: [UserModule, AuthModule, SharedModule],
  exports: [MeModule],
})
export class MeModule {}
