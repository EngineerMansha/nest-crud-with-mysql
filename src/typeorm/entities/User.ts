import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: 'mansha1234' })
  username: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column({ default: null })
  createdAt?: Date;
  @Column({ nullable: true })
  authStrategy: string;
}
