import { Module } from '@nestjs/common';
import { FtService } from './ft.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { XKeyGuard } from './x-key.guard';
import { AuthGuard } from './auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSession } from '@backend/typeorm/user-session.entity';
import { SocketAuthGuard } from './socket-auth.guard';
import { User } from '@backend/typeorm/user.entity';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    TypeOrmModule.forFeature([UserSession, User]),
  ],
  providers: [FtService, XKeyGuard, AuthGuard, SocketAuthGuard],
  exports: [FtService, XKeyGuard, AuthGuard, SocketAuthGuard],
})
export class SharedModule {}
