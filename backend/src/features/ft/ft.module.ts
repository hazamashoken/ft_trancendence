import { Module } from '@nestjs/common';
import { FtController } from './ft.controller';
import { SharedModule } from '@backend/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [FtController],
  providers: [],
})
export class FtModule {}
