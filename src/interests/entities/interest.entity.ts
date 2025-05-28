import { Project } from "src/projects/entities/project.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, Unique } from "typeorm";

@Entity({ name: "interest" })
export class Interest {
    @PrimaryGeneratedColumn("uuid", { name: "uuid" })
    uuid: string;

    @Column({ name: "name" })
    @Unique(['name'])
    name: string;

    @Column({ name: "createdAt", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    // ManyToMany relation with User
    @ManyToMany(() => User, user => user.interests)
    users: User[];

    // OneToMany relation with Project
    @OneToMany(() => Project, project => project.interest)
    projects: Project[];
}