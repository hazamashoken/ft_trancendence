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

  // private winRateCalculate(win: number, matchs: number): number {
  //   if (win === 0 && matchs === 0) {
  //     return 100.0;
  //   }
  //   return Math.round((win / matchs) * 100) * 10;
  // }

  private winRateCalculate(win: number, matchs: number): string {
    if (win === 0 && matchs === 0) {
      return Number(100).toFixed(2);
    }
    if (!Number(win)) {
      return Number((0 / matchs) * 100).toFixed(2);
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
    const user = await this.userRepository.findOne({ where: { id: userId } });
    // if (user) {
    //   throw new HttpException(
    //     'Duplicate stats, fail to create new stats.',
    //     HttpStatus.BAD_REQUEST
    //   )
    // }
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
    return this.statsRepository.find();
  }

  findStatsByUser(id: number) {
    return this.statsRepository.findOne({ where: { user: { id: id } }});
  }

  updateStatsByUser(id: number, updateStatsDto: UpdateStatsDto) {
    // const { win, ...statsDetail } = updateStatsDto;
    if (Number(updateStatsDto.win) && updateStatsDto.win < 0
      || Number(updateStatsDto.win) && updateStatsDto.win >= Number.MAX_VALUE) {
      throw new HttpException (
        'Fail to update the stats, win value is invalid.',
        HttpStatus.BAD_REQUEST
      )
    }
    if (Number(updateStatsDto.lose) && updateStatsDto.lose < 0
      || Number(updateStatsDto.lose) && updateStatsDto.lose >= Number.MAX_VALUE) {
      throw new HttpException (
        'Fail! to update the stats, lose value is invalid.',
        HttpStatus.BAD_REQUEST
      )
    }
    if (Number(updateStatsDto.point) && updateStatsDto.point < 0
      || Number(updateStatsDto.point) && updateStatsDto.point >= Number.MAX_VALUE) {
      throw new HttpException (
        'Fail! to update the stats, point value is invalid.',
        HttpStatus.BAD_REQUEST
      )
    }
    const matchs = this.matchsCalculate(updateStatsDto.win, updateStatsDto.lose);
    const winRate = this.winRateCalculate(updateStatsDto.win, matchs);
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
}
