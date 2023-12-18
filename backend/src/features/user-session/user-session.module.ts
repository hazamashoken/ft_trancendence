import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@backend/shared/shared.module';
import { UserSessionController } from './user-session.controller';
import { UserSessionService } from './user-session.service';
import { UserSession } from '@backend/typeorm/user-session.entity';
import { User } from '@backend/typeorm/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSession]), SharedModule],
  controllers: [UserSessionController],
  providers: [UserSessionService],
  exports: [UserSessionService, TypeOrmModule.forFeature([User, UserSession])],
})
export class UserSessionModule {}
