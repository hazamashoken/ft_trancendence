import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  messageId: number;

  @ApiProperty()
  @IsNotEmpty()
  message: string;
}
