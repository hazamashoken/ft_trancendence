import { Injectable } from '@nestjs/common';
import { CreateStatsDto } from './dto/create-stats.dto';
import { UpdateStatsDto } from './dto/update-stats.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Stats, User } from '@backend/typeorm';
import { Repository } from 'typeorm';
import { HttpCode } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { POINT_DEFAULT } from '@backend/typeorm/stats.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Stats)
    private readonly statsRepository: Repository<Stats>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  get repository() {
    return this.statsRepository;
  }

  private winRateCalculate(win: number, matchs: number): string {
    console.log(`[Debug]::win|${win}|matchs|${matchs}|`);
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

  async createNewStats(userId: number): Promise<Partial<Stats>> {
    // console.log(createStateDto);
    // console.log(userId);
    if (Number(userId) && userId < 0) {
      throw new HttpException(
        'Nagative user-id, fail to create new stats.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user: Partial<User> = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException(
        'No user for stats, fail to create new stats.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const stats: Partial<Stats> = await this.statsRepository.findOne({
      where: { user: { id: userId } },
    });
    if (stats) {
      throw new HttpException(
        'Duplicate stats, fail to create new stats.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newStats: Partial<Stats> = this.statsRepository.create({
      user: user,
      win: 0,
      lose: 0,
      point: POINT_DEFAULT,
      matchs: this.matchsCalculate(0, 0),
      winRate: this.winRateCalculate(0, 0),
    });
    return this.statsRepository.save(newStats);
  }

  mockUpDefualtStats(): Partial<Stats> {
    const win = 0;
    const lose = 0;
    const matchs: number = this.matchsCalculate(win, lose);
    return this.statsRepository.create({
      id: -1,
      win: win,
      lose: lose,
      matchs: matchs,
      winRate: this.winRateCalculate(win, matchs),
      point: POINT_DEFAULT,
      user: null,
    });
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
    const user: Partial<User> = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (user) {
      throw new HttpException(
        'Duplicate stats, fail to create new stats.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const matchs: number = this.matchsCalculate(
      createStatsDto.win,
      createStatsDto.lose,
    );
    const winRate: string = this.winRateCalculate(createStatsDto.win, matchs);
    const newStats: Partial<Stats> = this.statsRepository.create({
      user: user,
      matchs: matchs,
      winRate: winRate,
      ...statsDetail,
    });
    return this.statsRepository.save(newStats);
  }

  listAllStats() {
    return this.statsRepository.find({ relations: { user: true } });
  }

  async findStatsByUser(userId: number): Promise<Partial<Stats>> {
    const userStat = await this.statsRepository.findOne({
      where: { user: { id: userId } },
      relations: { user: true },
    });

    if (!userStat) {
      return this.createNewStats(userId);
    }

    return userStat;
  }

  async updateStatsByUser(id: number, updateStatsDto: UpdateStatsDto) {
    const userMatch: Partial<Stats> = await this.findStatsByUser(id);
    if (!userMatch) {
      throw new HttpException(
        'Fail! to update the stats, the user-id is not found.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const win: number = Number(updateStatsDto.win)
      ? updateStatsDto.win
      : userMatch.win;
    const lose: number = Number(updateStatsDto.lose)
      ? updateStatsDto.lose
      : userMatch.lose;
    const matchs: number = this.matchsCalculate(win, lose);
    const winRate: string = this.winRateCalculate(win, matchs);
    return this.statsRepository.update(
      {
        user: { id: id },
      },
      {
        matchs: matchs,
        winRate: winRate,
        ...updateStatsDto,
      },
    );
  }

  removeStatsByUser(id: number) {
    return this.statsRepository.delete({ user: { id: id } });
  }

  removeStatsById(id: number) {
    return this.statsRepository.delete({ id: id });
  }

  listAllStatsInDescOrder(): Promise<Partial<Stats>[]> {
    return this.statsRepository.find({
      order: { point: 'DESC' },
      relations: { user: true },
    });
  }

  listStatsInDescOederLimit(num: number): Promise<Partial<Stats>[]> {
    return this.statsRepository.find({
      order: { point: 'DESC' },
      skip: 0,
      take: num,
      relations: { user: true },
    });
  }

  async removeAllStats() {
    const allStats: Partial<Stats>[] = await this.listAllStats();
    for (let i = 0; i < allStats.length; ++i) {
      this.removeStatsById(allStats.at(i).id);
    }
  }
}
