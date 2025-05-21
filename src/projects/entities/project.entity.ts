import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Interest } from "src/interests/entities/interest.entity";

@Entity({ name: "project" }) // Explicit table name
export class Project {
    @PrimaryGeneratedColumn("uuid", { name: "uuid" })
    uuid: string;

    @Column({ name: "title" })
    title: string;

    @Column({ name: "description" })
    description: string;

    @Column({ name: "budget" })
    budget: number;

    @Column({ name: "category" })
    category: string;

    // User relation
    @ManyToOne(() => User, user => user.projects, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: "ownerId" })
    owner: User;

    @Column({ name: "createdAt", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    // Interest relation
    @ManyToOne(() => Interest, interest => interest.projects, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: "interestId" })
    interest: Interest;
}