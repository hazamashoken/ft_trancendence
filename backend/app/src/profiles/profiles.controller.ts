import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Profile } from '@entities/profile.entity';
import { CreateUserDto } from './dto/create-profile.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  findAll(): Promise<Profile[]> {
    return this.profilesService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: any): Promise<Profile> {
    return this.profilesService.findOne(params.id);
  }

  @Post()
  create(@Body() body: CreateUserDto): Promise<any> | any {
    console.log(body);
    return this.profilesService.create(body);
  }
}
