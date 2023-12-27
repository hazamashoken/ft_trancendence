import { User } from '@backend/typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

enum Status {
  Online = "Online",
  Offline = "Offline",
  InGame = "In Game",
}
export class UserStatus {
  @ApiProperty()
  user: User;

  @ApiProperty()
  @IsEnum(Status)
  status: Status;
}