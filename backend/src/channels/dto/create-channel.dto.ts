import { chatType } from '@backend/typeorm/channel.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class ChannelCreatedTO {
  @ApiProperty({ default: null })
  // @IsString()
  chatName: string;

  @ApiProperty()
  @IsNumber()
  chatOwner: number;

  @ApiProperty({ default: null })
  // @IsString()
  password: string;

  @ApiProperty({ default: null })
  // @IsNumber()
  maxUsers: number;

  @ApiProperty({ default: chatType.PUBLIC })
  chatType: chatType;
}
