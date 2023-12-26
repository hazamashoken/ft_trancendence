import { Module } from "@nestjs/common";
import { BlockUser } from "./dto/BlockUser.dto";
import { BlockUserController } from "./blockUser.controller";
import { BlockService } from "./blockUser.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@backend/typeorm";

@Module({
  imports: [
    TypeOrmModule.forFeature([BlockUser, User])
  ],
  controllers: [BlockUserController],
  providers: [BlockService],
  exports: [BlockService],
})
export class BlockUserModule { }