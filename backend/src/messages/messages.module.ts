import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import {
  MessagesEntity,
  ChannelsEntity,
  User,
  MutedEntity,
} from '@backend/typeorm';
import { BlockUser } from '@backend/block/dto/BlockUser.dto';
import { BlockService } from '@backend/block/blockUser.service';
import { ChannelsModule } from '@backend/channels/channels.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessagesEntity,
      ChannelsEntity,
      User,
      MutedEntity,
      BlockUser,
    ]),
    ChannelsModule,
  ],
  providers: [MessagesService, BlockService],
  exports: [MessagesService],
})
export class MessgesModule {}
