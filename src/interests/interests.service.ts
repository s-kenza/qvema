import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InterestsRepository } from './interests.repository';
import { Interest } from './entities/interest.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interest)
    private readonly interestsRepository: typeof InterestsRepository,
    private readonly logger: Logger) {}

    // Consulter tous les centres d'intérêt
    async findAll(): Promise<Interest[]> {
      return this.interestsRepository.find();
    }

    // Consulter les centres d'intérêt d'un utilisateur
    async findByUserId(userId: string): Promise<Interest[]> {
      if (!userId) {
        throw new BadRequestException('L\'ID de l\'utilisateur est requis');
      }
      const interests = await this.interestsRepository
      .createQueryBuilder('interest')
      .innerJoin('interest.users', 'user', 'user.uuid = :userId', { userId })
      .getMany();

      if (!interests) {
        throw new BadRequestException('Aucun centre d\'intérêt trouvé pour cet utilisateur');
      }
      return interests;
    }

    // Consulter les projets en fonction des centres d'intérêt de l'utilisateur
    async findProjectByInterests(userId: string): Promise<Interest[]> {
      if (!userId) {
        throw new BadRequestException('L\'ID de l\'utilisateur est requis');
      }
      
      // Récupérer les centres d'intérêt de l'utilisateur avec les projets associés
      const interests = await this.interestsRepository
        .createQueryBuilder('interest')
        .innerJoin('interest.users', 'user', 'user.uuid = :userId', { userId })
        .leftJoinAndSelect('interest.projects', 'project')
        .leftJoinAndSelect('project.owner', 'owner')
        .getMany();

      if (!interests || interests.length === 0) {
        throw new NotFoundException('Aucun centre d\'intérêt trouvé pour cet utilisateur');
      }
      
      // Filtrer les intérêts qui n'ont pas de projets
      const interestsWithProjects = interests.filter(interest => 
        interest.projects && interest.projects.length > 0
      );
      
      if (interestsWithProjects.length === 0) {
        throw new NotFoundException('Aucun projet trouvé correspondant à vos centres d\'intérêt');
      }
      
      return interestsWithProjects;
    }

    // Consulter les centres d'intérêt par nom
    async findByName(name: string): Promise<Interest | null> {
      if (!name) {
        throw new BadRequestException('Le nom de l\'intérêt est requis');
      }
      const interest = await this.interestsRepository.findOne({ where: { name } });
      if (!interest) {
        // Afficher une erreur si aucun centre d'intérêt n'est trouvé et montrer la liste des centres d'intérêt disponibles
        const allInterests = await this.interestsRepository.find();
        const availableInterests = allInterests.map(interest => interest.name).join(', ');
        throw new NotFoundException(`Aucun centre d'intérêt trouvé avec le nom "${name}". Voici les centres d'intérêt disponibles : ${availableInterests}`);
      }
      return interest;
    }

    async addInterestsToUser(userId: string, interests: Partial<Interest> | Partial<Interest>[]): Promise<Interest[]> {
      if (!userId) {
        throw new BadRequestException('L\'ID de l\'utilisateur est requis');
      }
      
      // Normaliser les données d'entrée pour garantir qu'on a un tableau
      const interestsArray = Array.isArray(interests) ? interests : [interests];
      
      if (interestsArray.length === 0) {
        throw new BadRequestException('Au moins un centre d\'intérêt doit être fourni');
      }

      let existingInterests;
      try {
        // Déterminer si nous avons des noms ou des UUIDs
        const hasUuid = interestsArray.some(interest => interest.uuid);
        const hasName = interestsArray.some(interest => interest.name);
        
        if (hasUuid) {
          // Si nous avons des UUIDs, chercher par UUID
          const interestIds = interestsArray.map(interest => interest.uuid);
          existingInterests = await this.interestsRepository.findBy({ 
            uuid: In(interestIds) 
          });
          
          console.log('Recherche par UUIDs:', interestIds);
        } else if (hasName) {
          // Si nous avons des noms, chercher par nom
          const interestNames = interestsArray.map(interest => interest.name);
          existingInterests = await this.interestsRepository.findBy({ 
            name: In(interestNames) 
          });
          
          console.log('Recherche par noms:', interestNames);
        } else {
          throw new BadRequestException('Les intérêts doivent avoir soit un uuid soit un nom');
        }

        console.log('Existing Interests:', existingInterests);
        
        // Vérifier si tous les intérêts ont été trouvés
        if (!existingInterests || existingInterests.length === 0) {
          const allInterests = await this.interestsRepository.find();
          const availableInterests = allInterests.map(interest => interest.name).join(', ');
          throw new NotFoundException(`Aucun centre d'intérêt trouvé. Voici les centres d'intérêt disponibles : ${availableInterests}`);
        }

        // Vérifier si certains intérêts n'ont pas été trouvés
        if (hasName && existingInterests.length !== interestsArray.length) {
          const foundNames = existingInterests.map(interest => interest.name);
          const notFoundNames = interestsArray
            .map(interest => interest.name)
            .filter(name => !foundNames.includes(name));
            
          const allInterests = await this.interestsRepository.find();
          const availableInterests = allInterests.map(interest => interest.name).join(', ');
          
          throw new NotFoundException(
            `Les centres d'intérêt suivants n'ont pas été trouvés : ${notFoundNames.join(', ')}. ` +
            `Voici les centres d'intérêt disponibles : ${availableInterests}`
          );
        }
        
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        this.logger.error(`Erreur lors de la récupération des intérêts: ${error.message}`);
        throw new BadRequestException(`Erreur lors de la récupération des intérêts: ${error.message}`);
      }

      // Associer les centres d'intérêt à l'utilisateur
      try {
        // Créer les relations
        await Promise.all(
          existingInterests.map(interest => 
            this.interestsRepository
              .createQueryBuilder()
              .relation(Interest, "users")
              .of(interest)
              .add(userId)
          )
        );

        // Retourner les intérêts mis à jour
        return this.findByUserId(userId);
      } catch (error) {
        this.logger.error(`Erreur lors de l'association des intérêts à l'utilisateur: ${error.message}`);
        throw new BadRequestException(`Erreur lors de l'association des intérêts: ${error.message}`);
      }
    }
}