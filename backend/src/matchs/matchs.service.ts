import { Injectable } from '@nestjs/common';
import { CreateMatchsDto } from './dto/create-matchs.dto';
import { UpdateMatchsDto } from './dto/update-matchs.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Match, User } from '@backend/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { TypeormQueryOption } from '@backend/interfaces/query-option.interface';
import { TypeormUtil } from '@backend/utils/typeorm.util';

@Injectable()
export class MatchsService {
  constructor(
    @InjectRepository(Match) private readonly matchRepository: Repository<Match>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createMatch(createMatchsDto: CreateMatchsDto) {
    const { player1Id, player2Id, ...matchDetail } = createMatchsDto;
    const player1 = await this.userRepository.findOne({ where: { id: player1Id} });
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
    const player2 = await this.userRepository.findOne({ where: { id: player2Id } });
    if (!player2) {
      throw new HttpException (
        'Player2 ID not found, Cannot create the match.',
        HttpStatus.BAD_REQUEST,
      )
    }
    // TODO add maxPoint comparation on this line..
    const newMatch = this.matchRepository.create({
      player1: player1,
      player2: player2,
      ...matchDetail,
    });
    // TODO update the user WIN RATE state...
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
  async addNewMatch(player1Id: number, player2Id: number, player1Point: number, player2Point: number): Promise<boolean> {
    const player1 = await this.userRepository.findOne({ where: { id: player1Id }, });
    if (!player1) {
     return false;
    }
    const player2 = await this.userRepository.findOne({ where: { id: player2Id } });
    if (!player2) {
      return false;
    }
    if (player1 === player2) {
     return false;
    }
     // TODO add maxPoint comparation on this line..
    const newMatch = this.matchRepository.create({
      player1: player1,
      player2: player2,
      player1Point: player1Point,
      player2Point: player2Point,
    });
    // TODO update the user WIN RATE state...
    this.matchRepository.save(newMatch);
    return true;
  }


  // TODO should return ERROR code for not found data in database.. ?
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
