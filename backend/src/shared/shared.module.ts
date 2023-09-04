import { Module } from '@nestjs/common';
import { FtService } from './ft.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [FtService],
  exports: [FtService],
})
export class SharedModule {}
