import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
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
import { POINT_DEFAULT } from '@backend/typeorm/stats.entity';
import { PongGateway } from '@backend/gateWay/pong.gateway';
import { Team } from '@backend/pong/pong.enum';

const PONE_WIN = 1;
const PTWO_WIN = 2;
@Injectable()
export class MatchsService {
  constructor(
    @InjectRepository(Match) private matchRepository: Repository<Match>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Stats) private statsRepository: Repository<Stats>,
    private readonly pongGateway: PongGateway,
  ) {}
  /*
   * [function] create a new match with defualt value |play2Id=NULL, player1Point=0, player2Point=0, status='WAITING'|.
   * by input the userID of player who own the match.
   * => [match] the match is success to created.
   * => [-1] the match is fail to created. */
  async createNewMatch(user: User): Promise<Match> {
    // if user is already in a match, return the match
    // TODO: May break when comparing two objects
    // const match = await this.matchRepository.findOne({
    //   where: { player1: { id: player1.id }, status: 'WAITING' || 'STARTING' },
    // });

    const match = await this.matchRepository
      .createQueryBuilder('match')
      .where(
        '(match.player1.id = :user AND (match.status = :waiting OR match.status = :starting))',
        { user: user.id, waiting: 'WAITING', starting: 'STARTING' },
      )
      .orWhere(
        '(match.player2.id = :user AND (match.status = :waiting OR match.status = :starting))',
        { user: user.id, waiting: 'WAITING', starting: 'STARTING' },
      )
      .getOne();

    // Logger.log(match);

    if (match) {
      throw new ConflictException("You're already in a match.");
    }

    const newMatch = await this.matchRepository.save({
      player1: user,
    });
    // move player to new room

    this.pongGateway
      .getGameInstance()
      .moveUserByName(
        user.intraLogin,
        newMatch.matchId.toString(),
        Team.player1,
      );
    return newMatch;
  }

  async joinMatch(matchId: number, userId: number): Promise<Match> {
    const match: Partial<Match> = await this.matchRepository.findOne({
      where: { matchId },
      relations: ['player1', 'player2'],
    });
    if (!match) {
      throw new NotFoundException('MatchId not found, Cannot join the match.');
    }

//     if (!match.player1) {
//       // move player 1 to room
//       this.pongGateway
//         .getGameInstance()
//         .moveUserByName(
//           user.intraLogin,
//           match.matchId.toString(),
//           Team.player1,
//         );
//       return await this.matchRepository.save({
//         ...match,
//         player1: user,
//         status: 'STARTING',
//       });
//     } else if (!match.player2) {
//       // move player 2 to room
//       this.pongGateway
//         .getGameInstance()
//         .moveUserByName(
//           user.intraLogin,
//           match.matchId.toString(),
//           Team.player2,
//         );
//       return await this.matchRepository.save({
//         ...match,
//         player2: user,
//         status: 'STARTING',
//       });
// =======
    const userX = await this.userRepository.findOne({ where: { id: userId } });
    if (!userX)
      throw new HttpException(
        'User not found, Cannot join the match.',
        HttpStatus.BAD_REQUEST,
      );
    if (await this.matchRepository.findOne({
      where: [
        { player1: { id: userId } },
        { player2: { id: userId } }
      ]
    })) {
      throw new HttpException(
        'User already in a match, Cannot join the match.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!match.player1) {
      this.pongGateway
        .getGameInstance()
        .moveUserByName(
          userX.intraLogin,
          match.matchId.toString(),
          Team.player1,
        );
      match.player1 = userX;
      match.status = 'WAITING';
      return await this.matchRepository.save(match);
    }

    if (!match.player2) {
      this.pongGateway
        .getGameInstance()
        .moveUserByName(
          userX.intraLogin,
          match.matchId.toString(),
          Team.player2,
        );
      match.player2 = userX;
      match.status = 'STARTING';
      return await this.matchRepository.save(match);
// >>>>>>> dev
    }
  
    throw new HttpException(
      'Match is full, Cannot join the match.',
      HttpStatus.BAD_REQUEST,
    );
  }

  // async leaveMatch(matchId: number, user: number): Promise<Match> {
  //   const match: Partial<Match> = await this.matchRepository.findOne({
  //     where: { matchId: matchId },
  //     relations: ['player1', 'player2'],
  //   });
  //   if (!match) {
  //     throw new NotFoundException('MatchId not found, Cannot leave the match.');
  //   }
  //   const userX = await this.userRepository.findOne({ where: { id: user } });
  //   if (match?.player1?.id === user) {
  //     // move player to public channel
  //     _gameInstance.moveUserByName(userX.intraLogin, 'public channel');
  //     // return await this.matchRepository.save({
  //     //   ...match,
  //     //   player1: null,
  //     //   status: 'WAITING',
  //     // });
  //     match.player1 = userX;
  //     match.status = 'WAITING';
  //     return await this.matchRepository.save(match);
  //   } else if (match?.player2?.id === user) {
  //     // move player to public channel
  //     _gameInstance.moveUserByName(userX.intraLogin, 'public channel');
  //     // return await this.matchRepository.save({
  //     //   ...match,
  //     //   player2: null,
  //     //   status: 'WAITING',
  //     // });
  //     match.player2 = null;
  //     match.status = 'WAITING';
  //     return await this.matchRepository.save(match);
  //   }

  //   throw new HttpException(
  //     'User is not in the match, Cannot leave the match.',
  //     HttpStatus.BAD_REQUEST,
  //   );
  //   return await this.matchRepository.save(match);
  // }

  async leaveMatch(matchId: number, userId: number): Promise<Match> {
    const match: Partial<Match> = await this.matchRepository.findOne({
      where: { matchId },
      relations: ['player1', 'player2'],
    });
  
    if (!match) {
      throw new NotFoundException('MatchId not found, Cannot leave the match.');
    }
// <<<<<<< feat/fix-pong
//     if (match?.player1?.id === user.id) {
//       // move player to public channel
//       this.pongGateway
//         .getGameInstance()
//         .moveUserByName(user.intraLogin, 'public channel');
//       return await this.matchRepository.save({
//         ...match,
//         player1: null,
//         status: 'WAITING',
//       });
//     } else if (match?.player2?.id === user.id) {
//       // move player to public channel
//       this.pongGateway
//         .getGameInstance()
//         .moveUserByName(user.intraLogin, 'public channel');
//       return await this.matchRepository.save({
//         ...match,
//         player2: null,
//         status: 'WAITING',
//       });
// =======
  
    const userX = await this.userRepository.findOne({ where: { id: userId } });
  
    if (match?.player1?.id === userId) {
      // _gameInstance.moveUserByName(userX.intraLogin, 'public channel');
      this.pongGateway
        .getGameInstance()
        .moveUserByName(userX.intraLogin, 'public channel');
      match.player1 = null;
      match.status = 'WAITING';
      if (!match?.player2) {
        this.matchRepository.delete({ matchId: matchId });
      }
      return await this.matchRepository.save(match);
    } else if (match?.player2?.id === userId) {
      // _gameInstance.moveUserByName(userX.intraLogin, 'public channel');
      this.pongGateway
        .getGameInstance()
        .moveUserByName(userX.intraLogin, 'public channel');
      match.player2 = null;
      match.status = 'WAITING';
      if (!match?.player1) {
        this.matchRepository.delete({ matchId: matchId });
      }
      return await this.matchRepository.save(match);
// >>>>>>> dev
    }
  
    throw new HttpException(
      'User is not in the match, Cannot leave the match.',
      HttpStatus.BAD_REQUEST,
    );
  }

  async deleteIfEmptyMatch(matchId: number): Promise<boolean> {
    const match: Partial<Match> = await this.matchRepository.findOne({
      where: { matchId: matchId },
    });
    if (!match) {
      throw new NotFoundException(
        'MatchId not found, Cannot delete the match.',
      );
    }
    if (!match.player1 && !match.player2) {
      this.matchRepository.delete({ matchId: matchId });
      return true;
    }
    return false;
  }

  /**
   * Internal use only for start match.
   * @param matchId
   * @returns
   */
  async startMatch(matchId: number): Promise<Match> {
    const match: Partial<Match> = await this.matchRepository.findOne({
      where: { matchId: matchId },
    });
    if (!match) {
      throw new NotFoundException('MatchId not found, Cannot start the match.');
    }
    return await this.matchRepository.save({
      ...match,
      status: 'PLAYING',
    });
  }

  async finishMatch(
    matchId: number,
    player1Point: number,
    player2Point: number,
  ): Promise<Match> {
    const match: Partial<Match> = await this.matchRepository.findOne({
      where: { matchId: matchId },
    });
    if (!match) {
      throw new NotFoundException(
        'MatchId not found, Cannot finish the match.',
      );
    }
    const result: number = player1Point > player2Point ? PONE_WIN : PTWO_WIN;
    this.updatePlayersStats(match.player1.id, match.player2.id, result);
    return await this.matchRepository.save({
      ...match,
      player1Point: player1Point,
      player2Point: player2Point,
      status: 'FINISHED',
    });
  }

  /*
   * [function] update a match status type [ 'WAITING', 'PLAYING', 'FINISHED' ].
   * by input the match-id and status.
   * => [true] the match status is success to update.
   * => [false] the math status is fail to update. */
  async updateStatus(matchId: number, status: MatchStatus): Promise<boolean> {
    const match: Partial<Match> = await this.matchRepository.findOne({
      where: { matchId: matchId },
    });
    if (!match) {
      console.log('MatchId not found, Cannot update the match status.');
      return false;
    }
    this.matchRepository.update({ matchId }, { status });
    return true;
  }

  /*
  ? need to put at the end of the match because the new user stats will create at the end of the match.
  * [fucntion] update a whole value of the match with out player1Id.
  * [ player2Id, player1Point, player1Point, player2Point, MatchStatus ]
  * by input matchId and the match attribute.
  * => [ture] the match status is success to update.
  * => [false] ther match status is fail to update. */
  async updateMatch(
    matchId: number,
    player2Id: number,
    player1Point: number,
    player2Point: number,
    status: MatchStatus,
  ): Promise<boolean> {
    const match: Partial<Match> = await this.matchRepository.findOne({
      where: { matchId: matchId },
    });
    if (!match) {
      console.log('MatchId not found, Cannot update the match value.');
      return false;
    }
    const user: Partial<User> = await this.userRepository.findOne({
      where: { id: player2Id },
    });
    if (!user) {
      console.log('Player2Id not found, Cannot update the match value.');
      return false;
    }
    if (player1Point < 0 || player2Point < 0) {
      console.log(
        'PlayerPoint valuse is invalid, Cannot update the match value.',
      );
      return false;
    }
    this.matchRepository.update(
      { matchId: matchId },
      {
        player1Point: player1Point,
        player2: user,
        player2Point: player2Point,
        status: status,
      },
    );
    const result: number = player1Point > player2Point ? PONE_WIN : PTWO_WIN;
    this.updatePlayersStats(match.player1.id, player2Id, result);
    return true;
  }

  private async updatePlayersStats(
    player1Id: number,
    player2Id: number,
    result: number,
  ): Promise<void> {
    const stats: StatsService = new StatsService(
      this.statsRepository,
      this.userRepository,
    );
    const player1Stats: Partial<Stats> = await stats.findStatsByUser(player1Id);
    const player2Stats: Partial<Stats> = await stats.findStatsByUser(player2Id);

    if (result == PONE_WIN) {
      const point1: number = player1Stats.point + 2;
      const point2: number =
        player2Stats.point - 1 >= 0 ? player2Stats.point - 1 : 0;
      stats.updateStatsByUser(player1Id, {
        win: player1Stats.win + 1,
        lose: player1Stats.lose,
        point: point1,
      });
      stats.updateStatsByUser(player2Id, {
        win: player2Stats.win,
        lose: player2Stats.lose + 1,
        point: point2,
      });
    } else {
      const point1: number =
        player1Stats.point - 1 >= 0 ? player1Stats.point - 1 : 0;
      const point2: number = player2Stats.point + 2;
      console.log(point1);
      stats.updateStatsByUser(player1Id, {
        win: player1Stats.win,
        lose: player1Stats.lose + 1,
        point: point1,
      });
      stats.updateStatsByUser(player2Id, {
        win: player2Stats.win + 1,
        lose: player2Stats.lose,
        point: point2,
      });
    }
  }

  async create(user: User): Promise<Partial<Match>> {
    const newMatch = this.matchRepository.create({
      player1: user,
    });
    return this.matchRepository.save(newMatch);
  }

  async createMatch(createMatchsDto: CreateMatchsDto): Promise<Partial<Match>> {
    const { player1Id, player2Id, ...matchDetail } = createMatchsDto;
    let player2: Partial<User>;
    const player1: Partial<User> = await this.userRepository.findOne({
      where: { id: player1Id },
    });
    if (player1Id === player2Id) {
      throw new HttpException(
        'Player1 ID and Player2 ID cannot be the same person.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!player1) {
      throw new HttpException(
        'Player1 ID not found, Cannot create the match.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (player2Id) {
      player2 = await this.userRepository.findOne({ where: { id: player2Id } });
      if (!player2) {
        throw new HttpException(
          'Player2 ID not found, Cannot create the match.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const newMatch: Partial<Match> = this.matchRepository.create({
      player1: player1,
      player2: player2,
      ...matchDetail,
    });
    if (matchDetail.status === 'FINISHED' && player2) {
      const player1Point = !Number(matchDetail.player1Point)
        ? 0
        : matchDetail.player1Point;
      const player2Point = !Number(matchDetail.player2Point)
        ? 0
        : matchDetail.player2Point;
      const result = player1Point >= player2Point ? PONE_WIN : PTWO_WIN;
      this.updatePlayersStats(player1.id, player2.id, result);
    }
    return this.matchRepository.save(newMatch);
  }

  findAll(playerId?: number, matchId?: number, option?: TypeormQueryOption) {
    const where = [];
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
      relations: { player1: true, player2: true },
    });
  }

  findAMatchById(id: number) {
    return this.matchRepository.findOne({
      where: { matchId: id },
      relations: { player1: true, player2: true },
    });
  }

  findMatchsByUser(id: number) {
    return this.matchRepository.find({
      where: [{ player1: { id: id } }, { player2: { id: id } }],
      relations: { player1: true, player2: true },
    });
  }

  async updateMatchProperty(id: number, updateMatchDto: UpdateMatchsDto) {
    const { player2Id, ...matchDetail } = updateMatchDto;
    const player2: Partial<User> = await this.userRepository.findOne({
      where: { id: player2Id },
    });
    if (!player2) {
      throw new HttpException(
        'the player2 cannot found by player2Id.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.matchRepository.update(
      { matchId: id },
      {
        player2: player2,
        ...matchDetail,
      },
    );
  }

  removeMatchById(id: number) {
    return this.matchRepository.delete({ matchId: id });
  }
}
