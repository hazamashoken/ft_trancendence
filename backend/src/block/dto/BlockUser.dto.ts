import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinTable, BaseEntity } from "typeorm"
import { User } from '../../typeorm/user.entity';
import { IsBoolean, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

@Entity('BlockUser')
export class BlockUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  blockedBy: User;

  @ManyToOne(() => User)
  blockedUser: User;
}


export class BlockUserDto {
  @IsNumber()
  @ApiProperty({ example: '2' })
  id: number;

  @IsNumber()
  @ApiProperty({ example: '2' })
  myId: number;
}

export class intraD
{
  @IsBoolean()
  register: boolean;

  @ApiProperty()
  user: User;
}