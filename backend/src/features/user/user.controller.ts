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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { FtService } from '@backend/shared/ft.service';
import { lastValueFrom } from 'rxjs';
import { QueryOption } from '@backend/pipe/query-option.decorator';
import { QueryOptionDto } from '@backend/dto/query-option.dto';

@Controller('users')
@UseGuards(XKeyGuard, AuthGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiTags('Users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly ftService: FtService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all user' })
  @ApiQuery({ name: 'option', type: QueryOptionDto, required: false })
  findAll(@QueryOption() option): Promise<User[]> {
    return this.userService.findAll(option);
  }

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  async create(
    @AuthUser() authUser: AuthUserInterface,
    @Body() body: CreateUserDto,
  ): Promise<any> {
    const existedProfile = await this.userService.getRepository().findOneBy({
      intraId: +body.intraId,
    });
    if (existedProfile) {
      throw new BadRequestException('Existed intra user');
    }
    const user42 = await lastValueFrom(
      this.ftService.user(authUser.accessToken, body.intraId),
    );
    body = {
      ...UserService.mapIntraUser(user42),
      ...body,
    };
    return this.userService.create(body);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOperation({ summary: 'Get user by id' })
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
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOperation({ summary: 'Update some user attribute' })
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    await this.verifyUser(id);
    return this.userService.update(+id, body);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOperation({ summary: 'Update user attribute with replacement' })
  async save(@Param('id') id: string, @Body() body: SaveUserDto) {
    await this.verifyUser(id);
    return this.userService.save(+id, body);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOperation({ summary: 'Delete user by id' })
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
