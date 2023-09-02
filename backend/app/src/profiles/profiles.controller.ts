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
  findOne(@Param('id') id: string): Promise<Profile> {
    if (!parseInt(id)) {
      throw new BadRequestException('Need user id');
    }
    return this.profilesService.findOne(+id).then((p: Profile) => {
      if (!p) {
        throw new NotFoundException('Not found user');
      }
      return p;
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    if (!parseInt(id)) {
      throw new BadRequestException('Need user id');
    }
    const profile = await this.profilesService.findOne(+id);
    if (!profile) {
      throw new NotFoundException('Not found user');
    }
    return this.profilesService.update(+id, body);
  }

  @Put(':id')
  async save(@Param('id') id: string, @Body() body: SaveUserDto) {
    return this.profilesService.save(+id, body);
  }
}
