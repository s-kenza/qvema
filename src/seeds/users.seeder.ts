import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';

export default class CreateUsers implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {
        await connection
            .createQueryBuilder()
            .insert()
            .into(User)
            .values([
                {
                    name: 'Alice', email: 'alice@example.com', password: 'password123'
                },
                {
                    name: 'Bob', email: 'bob@example.com', password: 'securepass'
                },
            ])
            .execute();
        }
}