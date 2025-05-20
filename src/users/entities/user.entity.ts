import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { UserRole } from 'src/enums/user-role.enum';

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
  @Column({ name: 'role', type: 'enum', enum: UserRole, default: UserRole.ENTREPRENEUR })
  role: UserRole;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Projects relation
  @OneToMany(() => Project, project => project.owner)
  projects: Project[];
}
