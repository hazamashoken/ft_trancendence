import { Module } from '@nestjs/common';
import { MatchsService } from './matchs.service';
import { MatchsController } from './matchs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match, Stats, User } from '@backend/typeorm';
import { SharedModule } from '@backend/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Match, User, Stats]), SharedModule],
  controllers: [MatchsController],
  providers: [MatchsService],
})
export class MatchsModule {}
