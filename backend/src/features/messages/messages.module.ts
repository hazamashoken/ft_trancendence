import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import {
  MessagesEntity,
  ChannelsEntity,
  User,
  MutedEntity,
} from '@backend/typeorm';
import { BlockUser } from '../block/dto/BlockUser.dto';
import { ChannelsModule } from '../channels/channels.module';
import { BlockService } from '../block/blockUser.service';

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
