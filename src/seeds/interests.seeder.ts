import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Interest } from '../interests/entities/interest.entity';

export default class InterestSeeder implements Seeder {
    public async run (
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const interestFactory = factoryManager.get(Interest);

        // Enregistre 10 centres d'intérêt
        await interestFactory.saveMany(10);
    }
}