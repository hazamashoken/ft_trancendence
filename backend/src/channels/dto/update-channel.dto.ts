import { chatType } from '@backend/typeorm/channel.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateChannelDto {
  @ApiProperty({ default: null })
  @IsOptional()
  @IsString()
  chatName: string;

  @ApiProperty({ default: null })
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty({ default: null })
  @IsOptional()
  @IsNumber()
  maxUsers: number;

  @ApiProperty({ default: null })
  @IsOptional()
  @IsEnum(chatType)
  chatType: chatType | null;
}
