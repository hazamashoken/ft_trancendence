import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stats, User } from '@backend/typeorm';
import { SharedModule } from '@backend/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Stats, User]), SharedModule],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService]
})
export class StatsModule {}
