import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { FtModule } from './ft/ft.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, FtModule, AuthModule],
  exports: [UserModule],
})
export class FeaturesModule {}
