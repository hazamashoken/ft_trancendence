import { Controller, Get } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Profile } from '@entities/profile.entity';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  findAll(): Promise<Profile[]> {
    return this.profilesService.findAll();
  }
}
