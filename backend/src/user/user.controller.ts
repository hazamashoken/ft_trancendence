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
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SaveUserDto } from './dto/save-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  async create(@Body() body: CreateUserDto): Promise<any> {
    const existedProfile = await this.userService.getRepository().findOneBy({
      intraId: +body.intraId,
    });
    if (existedProfile) {
      throw new BadRequestException('Existed intra user');
    }
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
