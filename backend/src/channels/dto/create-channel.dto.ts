import { chatType } from '@backend/typeorm/channel.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChannelCreatedTO {
  @ApiProperty({ default: null })
  chatName: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  chatOwner: number;

  @ApiProperty({ default: null })
  password: string;

  @ApiProperty({ default: null })
  maxUsers: number;

  @ApiProperty({ default: chatType.PUBLIC, enum: chatType })
  chatType:
    | chatType.PUBLIC
    | chatType.PRIVATE
    | chatType.DIRECT
    | chatType.PROTECTED;
}
