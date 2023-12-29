import { Module } from '@nestjs/common';
import { SocketGateway } from './chat.gateway';
import { SocketService } from './chatSocket.service';
import { SharedModule } from '@backend/shared/shared.module';
import { ChannelsModule } from '@backend/features/channels/channels.module';
import { BannedModule } from '@backend/features/banned/banned.module';
import { MutedModule } from '@backend/features/muted/muted.module';
import { MessgesModule } from '@backend/features/messages/messages.module';

@Module({
  providers: [SocketGateway, SocketService, ChannelsModule],
  imports: [ChannelsModule, BannedModule, MutedModule, MessgesModule, SharedModule],
  exports: [SocketGateway]
})
export class ChatSocketModule {}