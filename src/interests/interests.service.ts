import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InterestsRepository } from './interests.repository';
import { Interest } from './entities/interest.entity';
import { InjectRepository } from '@nestjs/typeorm';

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
      // La relation entre Interest et User est une relation ManyToMany,
      // pour obtenir les intérêts d’un utilisateur, il faut faire une requête relationnelle.

      if (!interests) {
        throw new BadRequestException('Aucun centre d\'intérêt trouvé pour cet utilisateur');
      }
      return interests;
    }

    // Consulter les projets en fonction des centres d'intérêt
    async findProjectById(interestId: string): Promise<Interest[]> {
      if (!interestId) {
        throw new BadRequestException('L\'ID de l\'intérêt est requis');
      }

      const projects = await this.interestsRepository
      .createQueryBuilder('interest')
      .innerJoinAndSelect('interest.projects', 'project', 'project.interest = :interestId', { interestId })
      .getMany();
      // La relation entre Interest et Project est une relation OneToMany,
      // pour obtenir les projets d’un intérêt, il faut faire une requête relationnelle.

      if (!projects) {
        throw new BadRequestException('Aucun projet trouvé pour cet intérêt');
      }
      return projects;
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
}