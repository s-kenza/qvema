import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'user' }) // Explicit table name
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  uuid: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'firstname' })
  firstname: string;

  @Column({ name: 'lastname' })
  lastname: string;

  // Enum for user roles
  @Column({ name: 'role', type: 'enum', enum: ['entrepreneur', 'investor', 'admin'], default: 'entrepreneur' })
  role: 'entrepreneur' | 'investor' | 'admin';

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
