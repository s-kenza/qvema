import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, JoinColumn, ManyToOne } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'investment' }) // Explicit table name
export class Investment {
    @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
    uuid: string;

    @Column({ name: 'amount' })
    amount: number;

    @Column({ name: 'date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    // Projects relation
    @ManyToOne(() => Project, project => project.investments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'projectId' })
    project: Project;

    // User relation
    @ManyToOne(() => User, user => user.investments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'investorId' })
    investor: User;
}
