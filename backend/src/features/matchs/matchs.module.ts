import { Module } from '@nestjs/common';
import { MatchsService } from './matchs.service';
import { MatchsController } from './matchs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match, Stats, User } from '@backend/typeorm';
import { SharedModule } from '@backend/shared/shared.module';
import { PongGateway } from '@backend/gateWay/pong.gateway';
import { GatewayModule } from '@backend/gateWay/gateway.module';
import { UserSessionModule } from '../user-session/user-session.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, User, Stats]),
    SharedModule,
    UserSessionModule,
  ],
  controllers: [MatchsController],
  providers: [MatchsService, PongGateway],
  exports: [MatchsService],
})
export class MatchsModule {}
