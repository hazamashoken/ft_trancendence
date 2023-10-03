import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '@entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@backend/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SharedModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule.forFeature([User])]
})
export class UserModule {}
