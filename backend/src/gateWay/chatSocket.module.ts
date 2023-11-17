import { Module } from '@nestjs/common';
import { SocketGateway } from './chat.gateway';
import { SocketService } from './chatSocket.service';
// import { ChannelsService } from '@backend/channels/channels.service';
import { ChannelsModule } from '@backend/channels/channels.module';
import { BannedModule } from '@backend/banned/banned.module';
import { MutedModule } from '@backend/muted/muted.module';
import { MessgesModule } from '@backend/messages/messages.module';

@Module({
  providers: [SocketGateway, SocketService],
  imports: [ChannelsModule, BannedModule, MutedModule, MessgesModule]
})
export class ChatSocketModule {}