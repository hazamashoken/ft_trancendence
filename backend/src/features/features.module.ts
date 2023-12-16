import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { FtModule } from './ft/ft.module';
import { AuthModule } from './auth/auth.module';
import { MeModule } from './me/me.module';
import { FriendModule } from './friend/friend.module';

@Module({
  imports: [MeModule, UserModule, FriendModule, FtModule, AuthModule],
  exports: [MeModule, UserModule, FtModule, AuthModule],
})
export class FeaturesModule {}
