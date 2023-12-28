import { Injectable } from '@nestjs/common';
import { CreateStatsDto } from './dto/create-stats.dto';
import { UpdateStatsDto } from './dto/update-stats.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Stats, User } from '@backend/typeorm';
import { Repository } from 'typeorm';
import { HttpCode } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Stats) private readonly statsRepository: Repository<Stats>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private winRateCalculate(win: number, matchs: number): string {
    console.log(`[Debug]::win|${win}|matchs|${matchs}|`)
    if (!Number(win)) {
      win = 0;
    }
    if (win === 0 && matchs === 0) {
      return Number(0).toFixed(2);
    }
    return Number((win / matchs) * 100).toFixed(2);
  }

  private matchsCalculate(win: number, lose: number): number {
    if (Number(win) && Number(lose)) {
      return win + lose;
    }
    if (Number(win)) {
      return win;
    }
    if (Number(lose)) {
      return lose;
    }
    return 0;
  }

  async createNewStats(createStateDto: CreateStatsDto) {
    // console.log(createStateDto);
    let { userId } = createStateDto;
    if (Number(userId) && userId > 0) {
      throw new HttpException(
        'Nagative user-id, fail to create new stats.',
        HttpStatus.BAD_REQUEST
      )
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException(
        'No user for stats, fail to create new stats.',
        HttpStatus.BAD_REQUEST
      )
    }
    const stats = await this.statsRepository.findOne({ where: { user: { id: userId} }});
    if (stats) {
      throw new HttpException(
        'Duplicate stats, fail to create new stats.',
        HttpStatus.BAD_REQUEST
      )
    }
    const newStats = this.statsRepository.create({
      user: user,
      winRate: this.winRateCalculate(0, 0),
    })
    return this.statsRepository.save(newStats);
  }

  async createCustomStats(createStatsDto: CreateStatsDto) {
    const { userId, ...statsDetail } = createStatsDto;
    if (!Number(createStatsDto.win)) {
      createStatsDto.win = 0;
    }
    if (!Number(createStatsDto.lose)) {
      createStatsDto.lose = 0;
    }
    // if (!Number(createStatsDto.point)) {
    //   createStatsDto.point = 1000;
    // }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      throw new HttpException(
        'Duplicate stats, fail to create new stats.',
        HttpStatus.BAD_REQUEST
      )
    }
    const matchs = this.matchsCalculate(createStatsDto.win, createStatsDto.lose);
    const winRate = this.winRateCalculate(createStatsDto.win, matchs);
    const newStats = this.statsRepository.create({
      user: user,
      matchs: matchs,
      winRate: winRate,
      ...statsDetail,
    })
    return this.statsRepository.save(newStats);
  }

  listAllStats() {
    return this.statsRepository.find({ relations: { user: true }});
  }

  findStatsByUser(id: number) {
    return this.statsRepository.findOne({ where: { user: { id: id } }, relations: { user: true }});
  }

  async updateStatsByUser(id: number, updateStatsDto: UpdateStatsDto){
    const userMatch = await this.findStatsByUser(id);
    if (!userMatch) {
      throw new HttpException(
        'Fail! to update the stats, the user-id is not found.',
        HttpStatus.BAD_REQUEST
      )
    }
    const win = Number(updateStatsDto.win) ? updateStatsDto.win : userMatch.win;
    const lose = Number(updateStatsDto.lose) ? updateStatsDto.lose : userMatch.lose;
    const matchs = this.matchsCalculate(win, lose);
    const winRate = this.winRateCalculate(win, matchs);
    return this.statsRepository.update(
      {
        user: { id: id }
      },
      {
        matchs: matchs,
        winRate: winRate,
        ...updateStatsDto,
      });
  }
  
  removeStatsByUser(id: number) {
    return this.statsRepository.delete({ user : { id: id } });
  }

  listAllStatsInDescOrder() {
    return this.statsRepository.find({ order: { point: 'DESC', }, relations: { user: true }})
  }

  listStatsInDescOederLimit(num: number) {
    return this.statsRepository.find({
      order: { point: "DESC" },
      skip: 0,
      take: num,
      relations: { user: true },
    },)
  }
}
