import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
@Unique([ 'displayName' ])
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'intra_id' })
  intraId: number;

  @ApiProperty()
  @Column({ name: 'intra_login', nullable: true })
  intraLogin: string;

  @ApiProperty()
  @Column({ name: 'intra_url' })
  intraUrl: string;

  @ApiProperty()
  @Column({ nullable: true })
  email: string;

  @ApiProperty()
  @Column({ name: 'first_name' })
  firstName: string;

  @ApiProperty()
  @Column({ name: 'last_name' })
  lastName: string;

  @ApiProperty()
  @Column({ name: 'display_name' })
  displayName: string;

  @ApiProperty()
  @Column({ name: 'image_url' })
  imageUrl: string;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
