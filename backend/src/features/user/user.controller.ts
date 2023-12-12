import { AuthUser } from '@backend/pipe/auth-user.decorator';
import { AuthUser as AuthUserInterface } from '@backend/interfaces/auth-user.interface';
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  BadRequestException,
  NotFoundException,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SaveUserDto } from './dto/save-user.dto';
import { XKeyGuard } from '@backend/shared/x-key.guard';
import { AuthGuard } from '@backend/shared/auth.guard';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FtService } from '@backend/shared/ft.service';
import { lastValueFrom } from 'rxjs';

@Controller('users')
@UseGuards(XKeyGuard, AuthGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService, private readonly ftService: FtService) {}

  @Get()
  findAll(@AuthUser() authUser): Promise<User[]> {
    console.log(authUser);
    return this.userService.findAll();
  }

  @Post()
  async create(@AuthUser() authUser: AuthUserInterface, @Body() body: CreateUserDto): Promise<any> {
    const existedProfile = await this.userService.getRepository().findOneBy({
      intraId: +body.intraId,
    });
    if (existedProfile) {
      throw new BadRequestException('Existed intra user');
    }
    const user42 = await lastValueFrom(this.ftService.user(authUser.accessToken, body.intraId));
    body = {
      ...UserService.mapIntraUser(user42),
      ...body,
    };
    return this.userService.create(body);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    await this.verifyUser(id);
    return this.userService.findOne(+id).then((u: User) => {
      if (!u) {
        throw new NotFoundException('Not found user');
      }
      return u;
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    await this.verifyUser(id);
    return this.userService.update(+id, body);
  }

  @Put(':id')
  async save(@Param('id') id: string, @Body() body: SaveUserDto) {
    await this.verifyUser(id);
    return this.userService.save(+id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.verifyUser(id);
    return this.userService.delete(+id);
  }

  async verifyUser(id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('Need user id');
    }
    const profile = await this.userService.findOne(+id);
    if (!profile) {
      throw new NotFoundException('Not found user');
    }
  }
}
