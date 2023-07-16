import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'profile' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    default: '',
  })
  login: string;

  @Column({
    name: 'email',
    nullable: false,
    default: '',
  })
  email: string;
}
