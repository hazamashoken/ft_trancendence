import { Module } from '@nestjs/common';
import { SessionGateway } from './session/session.geteway';
import { UserSessionModule } from '@backend/features/user-session/user-session.module';

@Module({
  providers: [SessionGateway],
  imports: [UserSessionModule],
})
export class GatewayModule {}
