import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Interest } from '../interests/entities/interest.entity';

export default class InterestSeeder implements Seeder {
    public async run (
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const interestFactory = factoryManager.get(Interest);
        const interestRepo = dataSource.getRepository(Interest);

        const numberToCreate = 10;

        for (let i = 0; i < numberToCreate; i++) {
            let interest = await interestFactory.make();

            // S'assurer de générer un nom unique à chaque fois (si nécessaire)
            while (await interestRepo.findOne({ where: { name: interest.name } })) {
                console.log(`L'intérêt "${interest.name}" existe déjà, génération d'un nouveau...`);
                interest = await interestFactory.make();
            }

            await interestRepo.save(interest);
        }

        console.log(`✅ Interest seeding terminé : ${numberToCreate} nouveaux centres d'intérêt créés.`);
    }
}
