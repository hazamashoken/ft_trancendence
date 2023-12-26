import { chatType } from '@backend/typeorm/channel.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChannelDto {
  @ApiProperty({ default: null })
  chatName: string;

  @ApiProperty({ default: null })
  password: string;

  @ApiProperty({ default: null })
  maxUsers: number;

  @ApiProperty({ default: null })
  chatType: chatType | null;
}
