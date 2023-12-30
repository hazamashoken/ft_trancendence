import { Module } from '@nestjs/common';
import { SessionGateway } from './session/session.geteway';
import { UserSessionModule } from '@backend/features/user-session/user-session.module';
import { SharedModule } from '@backend/shared/shared.module';
import { ChannelsModule } from '@backend/features/channels/channels.module';
import { ChatGateway } from './chat/chat.gateway';
import { BannedModule } from '@backend/features/banned/banned.module';
import { MessgesModule } from '@backend/features/messages/messages.module';
import { MutedModule } from '@backend/features/muted/muted.module';
import { ChatSocketService } from './chat/chatSocket.service';
import { PongGateway } from './pong.gateway';
import { MatchsModule } from '@backend/features/matchs/matchs.module';


@Module({
  providers: [SessionGateway, ChatGateway, ChatSocketService, PongGateway],
  imports: [
    UserSessionModule,
    SharedModule,
    ChannelsModule,
    BannedModule,
    MutedModule,
    MessgesModule,
  ],
})
export class GatewayModule {}
