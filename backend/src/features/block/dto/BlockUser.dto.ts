import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
  BaseEntity,
} from 'typeorm';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@backend/typeorm';

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
  userId: number;
}
