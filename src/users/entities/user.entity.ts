import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { UserRole } from 'src/enums/user-role.enum';
import { Interest } from 'src/interests/entities/interest.entity';
import { Investment } from 'src/investments/entities/investment.entity';

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

  // Interests relation
  @ManyToMany(() => Interest, interest => interest.users, { cascade: true })
  @JoinTable()
  interests: Interest[];

  // Investments relation
  @OneToMany(() => Investment, investment => investment.investor)
  investments: Investment[];
}
