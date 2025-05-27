import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Interest } from 'src/interests/entities/interest.entity';
import { UserRole } from 'src/enums/user-role.enum';

export default class UserSeeder implements Seeder {
    public async run (
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const userFactory = factoryManager.get(User);
        const interestRepo = dataSource.getRepository(Interest);
        const userRepo = dataSource.getRepository(User);

        const interests = await interestRepo.find();
        
        // Créer un tableau contenant tous les rôles disponibles
        const allRoles = Object.values(UserRole);
        
        // Phase 1: Création d'au moins un utilisateur de chaque rôle
        console.log('Phase 1: Création d\'au moins un utilisateur de chaque rôle');
        
        for (const role of allRoles) {
            const user = await userFactory.make();
            user.role = role;
            
            // Attribuer 1-3 intérêts aléatoires
            const numInterests = Math.floor(Math.random() * 3) + 1;
            user.interests = [];
            
            for (let j = 0; j < numInterests && j < interests.length; j++) {
                const randomIndex = Math.floor(Math.random() * interests.length);
                // Éviter les doublons d'intérêts
                if (!user.interests.some(interest => interest.uuid === interests[randomIndex].uuid)) {
                    user.interests.push(interests[randomIndex]);
                }
            }
            
            await userRepo.save(user);
            console.log(`Utilisateur créé avec le rôle ${role}: ${user.email}`);
        }
        
        // Phase 2: Création d'utilisateurs supplémentaires aléatoires
        console.log('Phase 2: Création d\'utilisateurs supplémentaires aléatoires');
        
        // Calculer combien d'utilisateurs supplémentaires sont nécessaires
        const requiredCount = allRoles.length; // Nombre minimum d'utilisateurs (1 par rôle)
        const targetCount = 10; // Nombre total d'utilisateurs souhaité
        const additionalUsersNeeded = Math.max(0, targetCount - requiredCount);
        
        for (let i = 0; i < additionalUsersNeeded; i++) {
            const user = await userFactory.make();
            // Le rôle est déjà aléatoire grâce à la factory
            
            // Attribuer 1-3 intérêts aléatoires
            const numInterests = Math.floor(Math.random() * 3) + 1;
            user.interests = [];
            
            for (let j = 0; j < numInterests && j < interests.length; j++) {
                const randomIndex = Math.floor(Math.random() * interests.length);
                if (!user.interests.some(interest => interest.uuid === interests[randomIndex].uuid)) {
                    user.interests.push(interests[randomIndex]);
                }
            }
            
            await userRepo.save(user);
        }
        
        console.log(`Seeding terminé: ${await userRepo.count()} utilisateurs au total`);
    }
}