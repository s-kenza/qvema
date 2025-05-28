import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Investment } from '../investments/entities/investment.entity';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/enums/user-role.enum';

export default class InvestmentSeeder implements Seeder {
    public async run (
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const investmentFactory = factoryManager.get(Investment);
        const investmentRepo = dataSource.getRepository(Investment);

        const projectRepo = dataSource.getRepository(Project);
        const projects = await projectRepo.find();

        const userRepo = dataSource.getRepository(User);
        const investors = await userRepo.find({ where: { role: UserRole.INVESTOR } });

        if (investors.length === 0) {
            console.log('❌ Aucun investisseur trouvé. Aucun investissement créé.');
            return;
        }

        // Enregistre 10 investissements
        await Promise.all(
            projects.slice(0, 10).map(async (project) => {
                const investment = await investmentFactory.make();
                investment.project = project;

                const randomInvestor = investors[Math.floor(Math.random() * investors.length)];
                investment.investor = randomInvestor;

                await investmentRepo.save(investment);
            })
        );

        const totalInvestments = await investmentRepo.count();
        console.log(`✅ Investment seeding terminé : ${totalInvestments} investissements au total.`);
    }
}