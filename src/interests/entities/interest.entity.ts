import { User } from "src/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";

@Entity({ name: "interest" })
export class Interest {
    @PrimaryGeneratedColumn("uuid", { name: "uuid" })
    uuid: string;

    @Column({ name: "name" })
    name: string;

    @Column({ name: "createdAt", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
}