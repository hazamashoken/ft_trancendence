import { User } from '@backend/typeorm';
import { BannedEntity } from '@backend/typeorm/banned.entity';
import { ChannelsEntity } from '@backend/typeorm/channel.entity';
import { MessagesEntity } from '@backend/typeorm/messages.entity';
import { MutedEntity } from '@backend/typeorm/muted.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';


@Module({
  imports: [TypeOrmModule.forFeature([ChannelsEntity, User, BannedEntity, MessagesEntity, MutedEntity])],
  // providers: [ChannelsService, BannedService, MessagesService, MutedService],
  providers: [ChannelsService],
  controllers: [ChannelsController],
  exports: [ChannelsService]
})
export class ChannelsModule {}