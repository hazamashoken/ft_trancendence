import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import {
  MessagesEntity,
  ChannelsEntity,
  User,
  MutedEntity,
} from '@backend/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessagesEntity,
      ChannelsEntity,
      User,
      MutedEntity,
    ]),
  ],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessgesModule {}
