import { AuthUser } from '@backend/pipe/auth-user.decorator';
import { AuthUser as AuthUserInterface } from '@backend/interfaces/auth-user.interface';
import { AuthGuard } from '@backend/shared/auth.guard';
import { XKeyGuard } from '@backend/shared/x-key.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { User } from '@backend/typeorm';
import { UpdateUserDto } from '@backend/features/user/dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('me/account')
@UseGuards(XKeyGuard, AuthGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiTags('Me')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @ApiOperation({ summary: 'Get user profile' })
  get(@AuthUser() authUser: AuthUserInterface) {
    if (!authUser.user) {
      throw new BadRequestException('User has not been created');
    }
    return this.accountService.get(authUser.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create user with intra profile' })
  create(@AuthUser() authUser: AuthUserInterface) {
    if (authUser.user) {
      throw new BadRequestException('User has been created');
    }
    return this.accountService.create(authUser.ft);
  }

  @Patch()
  @ApiOperation({ summary: 'Update user profile' })
  update(@AuthUser('user') user: User, @Body() body: UpdateUserDto) {
    if (!user) {
      throw new BadRequestException('User has not been created');
    }
    // Logger.log(body);
    return this.accountService.update(user.id, body);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'upload user avatar',
    description:
      'limit `jpg` and `png` file type and max size is 2MB. it will update `imageUrl` after save file succeed',
  }) // eslint-disable-line prettier/prettier
  uploadFile(
    @AuthUser('user') user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!this.accountService.validateAvatar(file)) {
      throw new BadRequestException('File size or type is not valid');
    }
    return this.accountService.saveAvatar(user.id, file);
  }
}
