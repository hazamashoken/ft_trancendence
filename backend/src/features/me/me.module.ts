import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { AccountController } from './account/account.controller';
import { FtModule } from '../ft/ft.module';

@Module({
  controllers: [
    AccountController,
  ],
  providers: [

  ],
  imports: [UserModule, AuthModule, FtModule],
  exports: [MeModule],
})
export class MeModule {}
