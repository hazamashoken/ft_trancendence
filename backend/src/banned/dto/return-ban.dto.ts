import { ReturnChanelDto } from '@backend/channels/dto/return-cnannel.dto';
import { User, ChannelsEntity } from '@backend/typeorm';
import { IsNumber, IsString } from 'class-validator';

export class ReturnBannedDto {
  @IsNumber()
  id: number;

  bannedUser: User;

  @IsString()
  bannedBy: string;

  @IsString()
  banReason: string;

  @IsString()
  bannedAt: string;
}
