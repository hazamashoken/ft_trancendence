import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@backend/shared/shared.module';
import { User } from '@backend/typeorm';
import { User2fa } from '@backend/typeorm/user_2fa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, User2fa]), SharedModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule.forFeature([User, User2fa])],
})
export class UserModule {}
