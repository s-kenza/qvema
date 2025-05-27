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

        // Nombre de centres d'intérêts à créer
        const targetCount = 10;

        // Récupérer les intérêts existants
        const existingCount = await interestRepo.count();
        const needToCreate = Math.max(0, targetCount - existingCount);

        // Pour éviter la création de doublons
        if (needToCreate > 0) {
            for (let i = 0; i < needToCreate; i++) {
                const interest = await interestFactory.make();
                
                // Vérifier s'il existe déjà
                const exists = await interestRepo.findOne({
                    where: { name: interest.name }
                });

                // Ne sauvegarder que s'il n'existe pas
                if (!exists) {
                    await interestRepo.save(interest);
                } else {
                    console.log(`L'intérêt ${interest.name} existe déjà, génération d'un nouveau...`);
                }
            }
        } else {
            console.log(`Il y a déjà ${existingCount} centres d'intérêts, aucun besoin de créer de nouveaux.`);
        }
    }
}