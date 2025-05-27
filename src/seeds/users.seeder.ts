import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Interest } from 'src/interests/entities/interest.entity';

export default class UserSeeder implements Seeder {
    public async run (
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const userFactory = factoryManager.get(User);
        const interestRepo = dataSource.getRepository(Interest);

        const interests = await interestRepo.find();

        for (let i = 0; i < 10; i++) {
            const user = await userFactory.make();
            const randomInterest = interests[Math.floor(Math.random() * interests.length)];
            user.interests = [randomInterest];
            await dataSource.getRepository(User).save(user);
        }
    }
}