import { Module } from "@nestjs/common";
import { BlockUser } from "./dto/BlockUser.dto";
import { BlockUserController } from "./blockUser.controller";
import { BlockService } from "./blockUser.service";

@Module({
  imports: [BlockUser],
  controllers: [BlockUserController],
  exports: [BlockService],
})
export class BlockUserModule {}