import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';

export default class ProjectSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const userRepository = dataSource.getRepository(User);
        const users = await userRepository.find();

        const projectFactory = factoryManager.get(Project);

        for (let i = 0; i < 5; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            await projectFactory.save({
                owner: randomUser,
            });
        }
    }
}
