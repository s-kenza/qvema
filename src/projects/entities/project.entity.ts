import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

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

    // Clé étrangère explicite
    @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "ownerId" })
    owner: User;

    @Column()
    ownerId: string;

    @Column({ name: "createdAt", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
}