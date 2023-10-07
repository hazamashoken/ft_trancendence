import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@backend/shared/shared.module';
import { User, Friends } from '@backend/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friends]), SharedModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule.forFeature([User, Friends])],
})
export class UserModule {}
