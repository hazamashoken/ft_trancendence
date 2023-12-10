import { Module } from '@nestjs/common';
import { PongGateway } from '../gateWay/pong.gateway';

@Module({
  providers: [PongGateway],
})
export class PongModule {}
