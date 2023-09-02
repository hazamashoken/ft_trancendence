
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Profile } from '@entities/profile.entity';
// import { Profile } from '../typeorm';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  findAll(): Promise<Profile[]> {
    return this.profileRepository.find();
  }

  findOne(id: string) {
    return this.profileRepository.findOneBy({ id: +id });
  }

  create(data: any) {
    const profile = this.profileRepository.create(data);
    return this.profileRepository.save(profile);
  }
}
