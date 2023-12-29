import { Module } from '@nestjs/common';
import { BlockUser } from './dto/BlockUser.dto';
import { BlockUserController } from './blockUser.controller';
import { BlockService } from './blockUser.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@backend/typeorm';
import { FtModule } from '@backend/features/ft/ft.module';
import { SharedModule } from '@backend/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([BlockUser, User]), SharedModule],
  controllers: [BlockUserController],
  providers: [BlockService],
  exports: [BlockService],
})
export class BlockUserModule {}
