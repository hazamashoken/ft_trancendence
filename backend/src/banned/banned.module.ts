import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannedService } from './banned.service';
import { BannedEntity, ChannelsEntity, User } from '@backend/typeorm';
import { ChannelsService } from '@backend/channels/channels.service';
import { ChannelsModule } from '@backend/channels/channels.module';

@Module({
  imports: [TypeOrmModule.forFeature([BannedEntity, ChannelsEntity, User]), ChannelsModule],
  providers: [BannedService],
  exports: [BannedService],
})
export class BannedModule {}
