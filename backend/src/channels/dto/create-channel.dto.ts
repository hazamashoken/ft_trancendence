import { chatType } from '@backend/typeorm/channel.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class ChannelCreatedTO {
  @ApiProperty({ default: null })
  chatName: string;

  @ApiProperty()
  @IsNumber()
  chatOwner: number;

  @ApiProperty({ default: null })
  password: string;

  @ApiProperty({ default: null })
  maxUsers: number;

  @ApiProperty({ default: chatType.PUBLIC })
  chatType: chatType;
}
