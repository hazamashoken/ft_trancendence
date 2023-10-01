import { Module } from '@nestjs/common';
import { FtService } from './ft.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { XKeyGuard } from './x-key.guard';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [FtService, XKeyGuard, AuthGuard],
  exports: [FtService, XKeyGuard, AuthGuard],
})
export class SharedModule {}
