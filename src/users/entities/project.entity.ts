import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { User } from "./user.entity";

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

    @Column({ name: "ownerId" })
    ownerId: string; // Assuming 'uuid' is a string type
}