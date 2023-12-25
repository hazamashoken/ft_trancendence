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
import { SharedModule } from '@backend/shared/shared.module';
import { SocketService } from '@backend/gateWay/chatSocket.service';
import { SocketGateway } from '@backend/gateWay/chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChannelsEntity,
      User,
      BannedEntity,
      MessagesEntity,
      MutedEntity,
    ]),
    SharedModule,
  ],
  providers: [ChannelsService, BannedService, MessagesService, MutedService, SocketService, SocketGateway],
  controllers: [ChannelsController],
  exports: [ChannelsService],
})
export class ChannelsModule {}
