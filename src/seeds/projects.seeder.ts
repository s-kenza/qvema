import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';

export default class ProjectSeeder implements Seeder {
    public async run (
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        // Récupère tous les utilisateurs existants
        const userRepository = dataSource.getRepository(User);
        const users = await userRepository.find();

        // Récupère la factory de projet
        const projectFactory = factoryManager.get(Project);

        // Enregistre 5 projets différents en bdd, chacun associé à un utilisateur aléatoire
        const projects = await projectFactory.saveMany(5);

        // Associe chaque projet à un utilisateur aléatoire et enregistre
        for (let i = 0; i < 5; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const project = await projectFactory.save({
                ownerId: randomUser.uuid,
            });
        }
    }
}