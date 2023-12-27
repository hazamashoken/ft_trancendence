import { Module } from '@nestjs/common';
import { MatchsService } from './matchs.service';
import { MatchsController } from './matchs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match, User } from '@backend/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Match, User])],
  controllers: [MatchsController],
  providers: [MatchsService],
})
export class MatchsModule {}
