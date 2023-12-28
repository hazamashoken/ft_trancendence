import { Injectable } from '@nestjs/common';
import { CreateMatchsDto } from './dto/create-matchs.dto';
import { UpdateMatchsDto } from './dto/update-matchs.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Match, Stats, User } from '@backend/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { TypeormQueryOption } from '@backend/interfaces/query-option.interface';
import { TypeormUtil } from '@backend/utils/typeorm.util';
import { MatchStatus } from '@backend/typeorm/match.entity';
import { StatsService } from '../stats/stats.service';

const PONE_WIN = 1;
const PTWO_WIN = 2;
@Injectable()
export class MatchsService {
  constructor(
    @InjectRepository(Match) private matchRepository: Repository<Match>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Stats) private statsRepository: Repository<Stats>,
  ) {}
  /*
  * [function] create a new match with defualt value |play2Id=NULL, player1Point=0, player2Point=0, status='WAITING'|.
  * by input the userID of player who own the match.
  * => [match] the match is success to created.
  * => [-1] the match is fail to created. */
  async createNewMatch(player1Id: number): Promise<number> {
    const player1 = await this.userRepository.findOne({ where: { id: player1Id} });
    if (!player1) {
      console.log ('Player1 ID not found, Cannot create the match.');
      return -1;
    }
    const newMatch = this.matchRepository.create({
      player1: player1,
    });
    this.matchRepository.save(newMatch);
    return newMatch.matchId;
  }

  /*
  * [function] update a match status type [ 'WAITING', 'PLAYING', 'FINISHED' ].
  * by input the match-id and status.
  * => [true] the match status is success to update.
  * => [false] the math status is fail to update. */
  async updateStatus(matchId: number, status: MatchStatus): Promise<boolean> {
    const match = await this.matchRepository.findOne({ where: { matchId: matchId } });
    if (!match) {
      console.log('MatchId not found, Cannot update the match status.');
      return false;
    }
    this.matchRepository.update({ matchId }, { status });
    return true;
  }

  /*
  * [fucntion] update a whole value of the match with out player1Id.
  * [ player2Id, player1Point, player1Point, player2Point, MatchStatus ]
  * by input matchId and the match attribute.
  * => [ture] the match status is success to update.
  * => [false] ther match status is fail to update. */
  async updateMatch(
    matchId: number, player2Id: number, player1Point: number, player2Point: number, status: MatchStatus): Promise<boolean> {
    const match = await this.matchRepository.findOne({ where: { matchId: matchId } });
    if (!match) {
      console.log('MatchId not found, Cannot update the match value.');
      return false;
    }
    const user = await this.userRepository.findOne({ where: { id: player2Id } });
    if (!user) {
      console.log('Player2Id not found, Cannot update the match value.');
      return false;
    }
    if (player1Point < 0 || player2Point < 0) {
      console.log('PlayerPoint valuse is invalid, Cannot update the match value.');
      return false;
    }
    this.matchRepository.update({ matchId: matchId }, {
      player1Point: player1Point,
      player2Id: player2Id,
      player2Point: player2Point,
      status: status,
    });
    console.log(`[Debug]::player1Id|${match.player1.id}|`)
    const result = player1Point > player2Point ? PONE_WIN : PTWO_WIN;
    this.updatePlayersStats(match.player1.id, player2Id, result);
    return true;
  }
  
  private async updatePlayersStats(player1Id: number, player2Id: number, result: number): Promise<void> {
    let stats: StatsService;
    const player1Stats = await this.statsRepository.findOne({ where: { user: { id: player1Id } }});
    const player2Stats = await this.statsRepository.findOne({ where: { user: { id: player2Id } }});
    if (result == PONE_WIN) {
      const point1 = player1Stats.point + 2;
      const point2 = player2Stats.point - 1 >= 0 ? player2Stats.point - 1 : 0;
      stats.updateStatsByUser(player1Id, { win: (player1Stats.win + 1), lose: player1Stats.lose, point: point1 });
      stats.updateStatsByUser(player1Id, { win: player1Stats.win, lose: (player1Stats.lose + 1), point: point2 });
    }
    else {
      const point1 = player1Stats.point - 1 >= 0 ? player2Stats.point - 1 : 0;
      const point2 = player2Stats.point + 2;
      stats.updateStatsByUser(player1Id, { win: player1Stats.win, lose: (player1Stats.lose + 1), point: point1 });
      stats.updateStatsByUser(player1Id, { win: (player1Stats.win + 1), lose: player1Stats.lose, point: point2 });
    }
  }

  // TODO add maxPoint comparation on this line..
  async createMatch(createMatchsDto: CreateMatchsDto) {
    const { player1Id, player2Id, ...matchDetail } = createMatchsDto;
    let player2: Partial<User>;
    const player1 = await this.userRepository.findOne({ where: { id: player1Id } });
    if (player1Id === player2Id) {
      throw new HttpException (
        'Player1 ID and Player2 ID cannot be the same person.',
        HttpStatus.BAD_REQUEST,
      )
    }
    if (!player1) {
      throw new HttpException (
        'Player1 ID not found, Cannot create the match.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (player2Id) {
      player2 = await this.userRepository.findOne({ where: { id: player2Id } });
      if (!player2) {
        throw new HttpException (
          'Player2 ID not found, Cannot create the match.',
          HttpStatus.BAD_REQUEST,
        )
      }
    }
    const newMatch = this.matchRepository.create({
      player1: player1,
      player2: player2,
      ...matchDetail,
    });
    if (matchDetail.status === 'FINISHED' && player2) {
      const player1Point = !Number(matchDetail.player1Point) ? 0 : matchDetail.player1Point;
      const player2Point = !Number(matchDetail.player2Point) ? 0 : matchDetail.player2Point;
      const result = player1Point >= player2Point ? PONE_WIN : PTWO_WIN;
      this.updatePlayersStats(player1.id , player2.id, result);
    }
    return this.matchRepository.save(newMatch);
  }

  // async createExample() {
  //   let player1Id: number;
  //   let player2Id: number;
  //
  //   player1Id = randomInt(5) + 1;
  //   player2Id = randomInt(5) + 1;
  //   console.log(player1Id);
  //   console.log(player2Id);
  //   while (player1Id === player2Id) {
  //     player2Id = randomInt(5) + 1;
  //   }
  //   const newMath = await this.addNewMatch(player1Id, player2Id, randomInt(10), randomInt(10));
  //   if (!newMath) {
  //     return 'FAIL! cannot add new match.'
  //   }
  //   return 'SUCESS!! new match was added.';
  // }
  //

  // * for the pong game to add the match result into database 

  findAll(
    playerId?: number,
    matchId?: number,
    option?: TypeormQueryOption
    ) {
    let where = [];
    if (playerId) {
      where.push({ player1: { id: playerId } });
      where.push({ player2: { id: playerId } });
    }
    if (matchId) {
      for (let i = 0; i < 2; ++i) {
        where[i] = Object.assign({ ...where[i], matchId: matchId });
      }
    }
    const findOption = TypeormUtil.setFindOption(option);
    return this.matchRepository.find({
      where,
      ...findOption,
      relations: { player1: true, player2: true},
    });
  }

  findAMatchById(id: number) {
    return this.matchRepository.findOne({
      where: { matchId: id },
      relations: { player1: true, player2: true},
    });
  }
  
  findMatchsByUser(id: number) {
    return this.matchRepository.find({
      where: [
        { player1: { id: id } },
        { player2: { id: id } },
      ],
      relations: { player1: true, player2: true},
    });
  }

  updateMatchProperty(id: number, updateMatchDto: UpdateMatchsDto) {
    return this.matchRepository.update({ matchId: id }, { ...updateMatchDto });
  }

  removeMatchById(id: number) {
    return this.matchRepository.delete({ matchId: id });
  }
}
