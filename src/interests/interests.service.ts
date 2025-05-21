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

    // Associer des centres d'intérêt à un utilisateur
}