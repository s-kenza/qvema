import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { Interest } from 'src/interests/entities/interest.entity';

export default class ProjectSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const projectFactory = factoryManager.get(Project);

        const userRepo = dataSource.getRepository(User);
        const users = await userRepo.find();

        const interestRepo = dataSource.getRepository(Interest);
        const interests = await interestRepo.find();

        await Promise.all(
            users.slice(0, 5).map(async (user) => {
                const project = await projectFactory.make();
                project.owner = user;

                const randomInterest = interests[Math.floor(Math.random() * interests.length)];
                project.interest = randomInterest;
                
                return dataSource.getRepository(Project).save(project);
            })
        )
    }
}
