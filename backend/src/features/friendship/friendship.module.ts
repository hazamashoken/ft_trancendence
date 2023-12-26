import { SharedModule } from '@backend/shared/shared.module';
import { User, Friendship } from '@backend/typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsController } from './friendship.controller';
import { FriendshipService } from './friendship.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friendship]), SharedModule],
  controllers: [FriendsController],
  providers: [FriendshipService],
  exports: [FriendshipService, TypeOrmModule.forFeature([User, Friendship])],
})
export class FriendshipModule {}
