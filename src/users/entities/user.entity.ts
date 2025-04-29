import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'user' }) // Explicit table name
export class User {
  @PrimaryGeneratedColumn({ name: 'id' }) // Map to 'id' column
  id: number;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'password' })
  password: string;
}
