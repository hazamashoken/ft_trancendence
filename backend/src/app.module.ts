import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import entities from './typeorm';
import { FeaturesModule } from './features/features.module';
import { SharedModule } from './shared/shared.module';
import { MutedModule } from './features/muted/muted.module';
import { ChatSocketModule } from './gateWay/chatSocket.module';
import { PongModule } from './pong/pong.module';

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
    MutedModule,
    ChatSocketModule,
    PongModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
