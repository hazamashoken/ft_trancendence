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
import { BlockService } from '@backend/block/blockUser.service';
import { BlockUserModule } from '@backend/block/blockUser.module';
import { BlockUser } from '@backend/block/dto/BlockUser.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChannelsEntity,
      User,
      BannedEntity,
      MessagesEntity,
      MutedEntity,
      BlockUser,
    ]),
    SharedModule,
    BlockUserModule
  ],
  providers: [ChannelsService, BannedService, MessagesService, MutedService, SocketService, SocketGateway, BlockService],
  controllers: [ChannelsController],
  exports: [ChannelsService],
})
export class ChannelsModule {}
