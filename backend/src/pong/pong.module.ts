import { Module } from '@nestjs/common';
import { PongGateway } from '../gateWay/pong.gateway';
import { SharedModule } from '@backend/shared/shared.module';

@Module({
  providers: [PongGateway],
  imports: [SharedModule]
})
export class PongModule {}
