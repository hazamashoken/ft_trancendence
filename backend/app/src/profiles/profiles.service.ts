import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Profile } from '@entities/profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  getRepository() {
    return this.profileRepository;
  }

  findAll(): Promise<Profile[]> {
    return this.profileRepository.find();
  }

  findOne(id: number) {
    return this.profileRepository.findOneBy({ id });
  }

  create(data: any) {
    const profile = this.profileRepository.create(data);
    return this.profileRepository.save(profile);
  }

  update(id: number, data: any): Promise<void | Profile> {
    return this.profileRepository
      .update({ id }, data)
      .then(() => this.findOne(id))
      .catch((e) => {
        console.log(e);
        if (e.name === 'EntityPropertyNotFoundError') {
          throw new BadRequestException(e.message);
        }
      });
  }

  async save(id: number, data: any): Promise<any> {
    const pBody = this.profileRepository.create(data as Profile);
    const pData = await this.profileRepository.findOneBy({ id });
    pBody.intraId = pData.intraId;
    return this.profileRepository.save(pBody);
  }

  delete(id: number) {
    return this.profileRepository.delete({ id });
  }
}
