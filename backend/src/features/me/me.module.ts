import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { AccountController } from './account/account.controller';
import { SharedModule } from '@backend/shared/shared.module';
import { AccountService } from './account/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@backend/typeorm';

@Module({
  controllers: [
    AccountController,
  ],
  providers: [
    AccountService
  ],
  imports: [UserModule, AuthModule, SharedModule],
  exports: [MeModule],
})
export class MeModule {}
