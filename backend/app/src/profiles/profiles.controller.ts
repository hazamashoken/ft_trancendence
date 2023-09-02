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
import { ProfilesService } from './profiles.service';
import { Profile } from '@entities/profile.entity';
import { CreateUserDto } from './dto/create-profile.dto';
import { UpdateUserDto } from './dto/update-profile.dto';
import { SaveUserDto } from './dto/save-profile.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  findAll(): Promise<Profile[]> {
    return this.profilesService.findAll();
  }

  @Post()
  create(@Body() body: CreateUserDto): Promise<any> {
    const existedProfile = this.profilesService.getRepository().findOneBy({
      intraId: +body.intraId,
    });
    if (existedProfile) {
      throw new BadRequestException('Existed intra user');
    }
    return this.profilesService.create(body);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Profile> {
    await this.verifyUser(id);
    return this.profilesService.findOne(+id).then((p: Profile) => {
      if (!p) {
        throw new NotFoundException('Not found user');
      }
      return p;
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    await this.verifyUser(id);
    return this.profilesService.update(+id, body);
  }

  @Put(':id')
  async save(@Param('id') id: string, @Body() body: SaveUserDto) {
    await this.verifyUser(id);
    return this.profilesService.save(+id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.verifyUser(id);
    return this.profilesService.delete(+id);
  }

  async verifyUser(id: string) {
    if (!parseInt(id)) {
      throw new BadRequestException('Need user id');
    }
    const profile = await this.profilesService.findOne(+id);
    if (!profile) {
      throw new NotFoundException('Not found user');
    }
  }
}
