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
import { MutedService } from '@backend/features/muted/muted.service';
import { SharedModule } from '@backend/shared/shared.module';
import { SocketService } from '@backend/gateWay/chatSocket.service';
import { SocketGateway } from '@backend/gateWay/chat.gateway';
import { BlockUser } from '../block/dto/BlockUser.dto';
import { BlockUserModule } from '../block/blockUser.module';
import { BannedService } from '../banned/banned.service';
import { MessagesService } from '../messages/messages.service';
import { BlockService } from '../block/blockUser.service';

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
