import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stats, User } from '@backend/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Stats, User])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
