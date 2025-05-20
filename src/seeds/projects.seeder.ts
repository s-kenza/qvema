import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';

export default class ProjectSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const projectFactory = factoryManager.get(Project);

        const userRepo = dataSource.getRepository(User);
        const users = await userRepo.find();
        console.log('Found users: ', users.length)

         if (users.length === 0) {
            console.log('No users found — skipping project creation.');
            return;
        }

        await Promise.all(
            users.slice(0, 5).map(async (user) => {
                const project = await projectFactory.make();
                project.owner = user;
                return dataSource.getRepository(Project).save(project);
            })
        )
    }
}
