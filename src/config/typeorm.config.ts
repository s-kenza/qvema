import { DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import { User } from "../users/entities/user.entity";

export const typeOrmConfig: DataSourceOptions & SeederOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt((process.env.DB_PORT ?? '3306'), 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'qvema',
    synchronize: process.env.NODE_ENV !== 'production',
    ssl: false,
    entities: [User],
    seeds: ['src/seeds/**/*{.ts,.js}'],
    factories: ['src/factories/**/*{.ts,.js}'],
};