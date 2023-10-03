import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { FtModule } from './ft/ft.module';
import { AuthModule } from './auth/auth.module';
import { MeModule } from './me/me.module';

@Module({
  imports: [MeModule, UserModule, FtModule, AuthModule],
  exports: [UserModule, MeModule],
})
export class FeaturesModule {}
