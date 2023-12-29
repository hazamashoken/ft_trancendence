import { Module } from '@nestjs/common';
import { FtController } from './ft.controller';
import { SharedModule } from '@backend/shared/shared.module';
import { FtService } from '@backend/shared/ft.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [SharedModule],
  controllers: [FtController],
  // providers: [FtService],
  // exports: [FtService],
})
export class FtModule {}
