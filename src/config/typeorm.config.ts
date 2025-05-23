import { DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import { User } from "../users/entities/user.entity";
import { Project } from "src/projects/entities/project.entity";
import { Interest } from "src/interests/entities/interest.entity";
import UserSeeder from "src/seeds/users.seeder";
import ProjectSeeder from "src/seeds/projects.seeder";
import InterestSeeder from "src/seeds/interests.seeder";
import { Investment } from "src/investments/entities/investment.entity";
import InvestmentSeeder from "src/seeds/investments.seeder";

export const typeOrmConfig: DataSourceOptions & SeederOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt((process.env.DB_PORT ?? '3306'), 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'qvema',
    synchronize: process.env.NODE_ENV !== 'production',
    ssl: false,
    entities: [User, Project, Interest, Investment],
    seeds: [InterestSeeder, UserSeeder, ProjectSeeder, InvestmentSeeder],
    factories: ['src/factories/**/*{.ts,.js}'],
};