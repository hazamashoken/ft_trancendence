import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MutedService } from './muted.service';
import { MutedEntity, ChannelsEntity, User } from '@backend/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MutedEntity, ChannelsEntity, User])],
  providers: [MutedService],
  exports: [MutedService],
})
export class MutedModule {}
