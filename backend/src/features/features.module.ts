import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { FtModule } from './ft/ft.module';
import { AuthModule } from './auth/auth.module';
import { MeModule } from './me/me.module';
import { FriendshipModule } from './friendship/friendship.module';

@Module({
  imports: [MeModule, UserModule, FriendshipModule, FtModule, AuthModule],
  exports: [MeModule, UserModule, FtModule, AuthModule],
})
export class FeaturesModule {}
