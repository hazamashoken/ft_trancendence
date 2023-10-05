import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { AccountController } from './account/account.controller';
import { SharedModule } from '@backend/shared/shared.module';
import { AccountService } from './account/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@backend/typeorm';
import { SecurityController } from './security/security.controller';
import { SecurityService } from './security/security.service';

@Module({
  controllers: [
    AccountController,
    SecurityController
  ],
  providers: [
    AccountService,
    SecurityService
  ],
  imports: [UserModule, AuthModule, SharedModule],
  exports: [MeModule],
})
export class MeModule {}
