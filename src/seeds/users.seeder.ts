import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';

export default class UserSeeder implements Seeder {
    public async run (
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const userFactory = factoryManager.get(User);

        // Enregistre 5 utilisateurs différents en bdd
        await userFactory.saveMany(5);
    }
}