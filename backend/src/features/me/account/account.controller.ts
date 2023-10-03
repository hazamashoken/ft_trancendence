import { CreateUserDto } from '@backend/features/user/dto/create-user.dto';
import { UserService } from '@backend/features/user/user.service';
import { FtUser } from '@backend/interfaces/ft-user.interface';
import { AuthUser } from '@backend/pipe/auth-user.decorator';
import { AuthGuard } from '@backend/shared/auth.guard';
import { XKeyGuard } from '@backend/shared/x-key.guard';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

@Controller('me/account')
@UseGuards(XKeyGuard, AuthGuard)
export class AccountController {
  constructor(private readonly userService: UserService) {}

  @Get()
  get(@AuthUser() authUser: FtUser) {
    return this.userService.getRepository().find();
  }

  @Post()
  create(@AuthUser() authUser: FtUser) {
    // const user = this.userService.getByIntraId(authUser.)
    return authUser;
  }
}
