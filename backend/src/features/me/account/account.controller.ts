import { CreateUserDto } from '@backend/features/user/dto/create-user.dto';
import { UserService } from '@backend/features/user/user.service';
import { FtUser } from '@backend/interfaces/ft-user.interface';
import { AuthUser } from '@backend/pipe/auth-user.decorator';
import { AuthUser as AuthUserInterface } from '@backend/interfaces/auth-user.interface';
import { AuthGuard } from '@backend/shared/auth.guard';
import { XKeyGuard } from '@backend/shared/x-key.guard';
import { BadRequestException, Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('me/account')
@UseGuards(XKeyGuard, AuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  get(@AuthUser() authUser: AuthUserInterface) {
    if (!authUser.user) {
      throw new BadRequestException('User has not been created');
    }
    return this.accountService.get(authUser.user.id);
  }

  @Post()
  create(@AuthUser() authUser: AuthUserInterface) {
    if (authUser.user) {
      throw new BadRequestException('User has been created');
    }
    return this.accountService.create(authUser.ft).then(res => );
  }
}
