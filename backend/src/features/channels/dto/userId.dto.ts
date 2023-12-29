import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class userId {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

export class chatId {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  chatId: number;
}

export class chatDelete {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  chatId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

export class addUserByName {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  chatId: number;
}

export class adminRemove {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  chatId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  adminId: number;
}

export class messageRem {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  chatId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  messageId: number;
}

export class muteD {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

export class chatD {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  chatId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
