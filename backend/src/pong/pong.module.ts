import { Module } from '@nestjs/common';
import { PongGateway } from '../gateWay/pong.gateway';
import { AuthModule } from '@backend/features/auth/auth.module';
import { SharedModule } from '@backend/shared/shared.module';

@Module({
  imports: [AuthModule, SharedModule],
  providers: [PongGateway],
})
export class PongModule {}
