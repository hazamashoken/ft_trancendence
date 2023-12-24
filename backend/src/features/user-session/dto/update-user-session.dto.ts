import { FtUser } from '@backend/interfaces/ft-user.interface';
import { UserSessionStatusType } from '@backend/typeorm/user-session.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsIn } from 'class-validator';

export class UpdateUserSessionDto {
  @IsIn(['ONLINE', 'OFFLINE', 'IN_GAME'])
  @ApiProperty({ description: 'User Status', example: 'ONLINE' })
  status: UserSessionStatusType;

  @IsEmpty()
  @ApiProperty({ description: 'Not allow to update in api' })
  userId?: string;

  @IsEmpty()
  @ApiProperty({ description: 'Not allow to update in api' })
  accessToken?: string;

  @IsEmpty()
  @ApiProperty({ description: 'Not allow to update in api' })
  expiredTokenTimestamp?: string;

  @IsEmpty()
  @ApiProperty({ description: 'Not allow to update in api' })
  ftUser: FtUser;
}
