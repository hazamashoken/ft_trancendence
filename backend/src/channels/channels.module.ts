import {
  BannedEntity,
  ChannelsEntity,
  MessagesEntity,
  MutedEntity,
  User,
} from '@backend/typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { BannedService } from '@backend/banned/banned.service';
import { MessagesService } from '@backend/messages/messages.service';
import { MutedService } from '@backend/muted/muted.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChannelsEntity,
      User,
      BannedEntity,
      MessagesEntity,
      MutedEntity,
    ]),
  ],
  providers: [ChannelsService, BannedService, MessagesService, MutedService],
  controllers: [ChannelsController],
  exports: [ChannelsService],
})
export class ChannelsModule {}
