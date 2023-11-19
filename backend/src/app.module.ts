import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import entities from './typeorm';
import { FeaturesModule } from './features/features.module';
import { SharedModule } from './shared/shared.module';
import { ChannelsModule } from './channels/channels.module';
import { BannedModule } from './banned/banned.module';
import { MessgesModule } from './messages/messages.module';
import { MutedModule } from './muted/muted.module';
import { ChatSocketModule } from './gateWay/chatSocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') ?? 'localhost',
        port: +configService.get<number>('DB_PORT') ?? 5432,
        username: configService.get('DB_USERNAME') ?? 'root',
        password: configService.get('DB_PASSWORD') ?? '424242',
        database: configService.get('DB_NAME') ?? 'ft_trancendence',
        entities: entities,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    SharedModule,
    FeaturesModule,
    ChannelsModule,
    BannedModule,
    MessgesModule,
    MutedModule,
    ChatSocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
