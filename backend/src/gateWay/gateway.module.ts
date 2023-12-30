import { Module } from '@nestjs/common';
import { SessionGateway } from './session/session.geteway';
import { UserSessionModule } from '@backend/features/user-session/user-session.module';
import { SharedModule } from '@backend/shared/shared.module';

@Module({
  providers: [SessionGateway],
  imports: [UserSessionModule, SharedModule],
})
export class GatewayModule {}
