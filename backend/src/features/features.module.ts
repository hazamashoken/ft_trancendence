import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { FtModule } from './ft/ft.module';

@Module({
  imports: [UserModule, FtModule],
  exports: [UserModule],
})
export class FeaturesModule {}
