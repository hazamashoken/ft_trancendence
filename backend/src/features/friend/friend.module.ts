import { SharedModule } from '@backend/shared/shared.module';
import { User, Friend } from '@backend/typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsController } from './friend.controller';
import { FriendService } from './friend.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friend]), SharedModule],
  controllers: [FriendsController],
  providers: [FriendService],
  exports: [FriendService, TypeOrmModule.forFeature([User, Friend])],
})
export class FriendModule {}
