import { User } from '@backend/typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsDate, IsNumber, IsObject, IsString } from 'class-validator';

export class ReturnChanelDto {
  @ApiProperty()
  @IsNumber()
  chatId: number;

  @ApiProperty()
  @IsString()
  chatName: string;

  @ApiProperty()
  @IsDate()
  creationDate: Date;

  maxUsers: number;

  @IsObject()
  chatOwner: User;
}
