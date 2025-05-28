import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { Interest } from 'src/interests/entities/interest.entity';
import { UserRole } from 'src/enums/user-role.enum';

export default class ProjectSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const projectFactory = factoryManager.get(Project);
        const userRepo = dataSource.getRepository(User);
        const interestRepo = dataSource.getRepository(Interest);
        const projectRepo = dataSource.getRepository(Project);

        const entrepreneurs = await userRepo.find({ where: { role: UserRole.ENTREPRENEUR } });
        const interests = await interestRepo.find();

        await Promise.all(
            entrepreneurs.slice(0, 5).map(async (entrepreneur) => {
                const project = await projectFactory.make();
                const randomInterest = interests[Math.floor(Math.random() * interests.length)];

                project.owner = entrepreneur;
                project.interest = randomInterest;
                project.category = randomInterest.name;

                await projectRepo.save(project);
            })
        );

        const totalProjects = await projectRepo.count();
        console.log(`✅ Project seeding terminé : ${totalProjects} projets au total.`);
    }
}