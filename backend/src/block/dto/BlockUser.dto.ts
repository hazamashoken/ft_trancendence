import {Entity, PrimaryGeneratedColumn, ManyToOne, JoinTable, BaseEntity} from "typeorm"
import { User } from '../../typeorm/user.entity';

@Entity('BlockUser')
export class BlockUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  blockedBy: User;

  @ManyToOne(() => User)
  blockedUser: User;
}
