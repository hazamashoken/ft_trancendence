import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { FtModule } from './ft/ft.module';
import { AuthModule } from './auth/auth.module';
import { MeModule } from './me/me.module';
import { FriendshipModule } from './friendship/friendship.module';
import { UserSessionModule } from './user-session/user-session.module';
import { MatchsModule } from './matchs/matchs.module';
import { GatewayModule } from '@backend/gateWay/gateway.module';
import { StatsModule } from './stats/stats.module';
import { ChannelsModule } from './channels/channels.module';
import { MessgesModule } from './messages/messages.module';
import { BannedModule } from './banned/banned.module';
import { BlockUserModule } from './block/blockUser.module';
// import { PongModule } from '@backend/pong/pong.module';

@Module({
  imports: [
    MeModule,
    UserModule,
    FriendshipModule,
    FtModule,
    AuthModule,
    UserSessionModule,
    GatewayModule,
    MatchsModule,
    StatsModule,
    ChannelsModule,
    BannedModule,
    MessgesModule,
    BlockUserModule,
  ],
  exports: [
    MeModule,
    UserModule,
    FriendshipModule,
    FtModule,
    AuthModule,
    UserSessionModule,
    GatewayModule,
    MatchsModule,
    StatsModule,
    ChannelsModule,
    BannedModule,
    MessgesModule,
    BlockUserModule,
  ],
})
export class FeaturesModule {}
