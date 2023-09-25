import { ChannelsEntity, User } from '@backend/typeorm';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export class ReturnMutedDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsObject()
  user: User;

  @IsNotEmpty()
  @IsNumber()
  mutedAt: ChannelsEntity;

  @IsNotEmpty()
  @IsString()
  mutedBy: User;

  @IsNotEmpty()
  @IsDate()
  mutedUntil: Date;
}
