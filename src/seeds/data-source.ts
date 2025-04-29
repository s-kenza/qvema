import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'mydb',
  entities: [User],
  synchronize: true,
});
