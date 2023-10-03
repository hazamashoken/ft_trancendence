import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { AccountController } from './account/account.controller';
import { SharedModule } from '@backend/shared/shared.module';

@Module({
  controllers: [
    AccountController,
  ],
  providers: [

  ],
  imports: [UserModule, AuthModule, SharedModule],
  exports: [MeModule],
})
export class MeModule {}
