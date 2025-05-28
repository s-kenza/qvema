import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Interest } from 'src/interests/entities/interest.entity';
import { InterestsRepository } from 'src/interests/interests.repository';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: typeof ProjectsRepository,
    @InjectRepository(Interest)
    private interestsRepository: typeof InterestsRepository,
    private readonly logger: Logger,
  ) {}


    // Consulter un projet par ID
    async findById(uuid: string): Promise<Project | null> {
      return this.projectsRepository.findOne({ 
        where: { uuid },
        relations: ['interest', 'owner']
      });
    }

    // Consulter tous les projets
    async findAll(): Promise<Project[]> {
      return this.projectsRepository.find();
    }

    // Créer un projet
    async create(projectData: Partial<Project>): Promise<Project> {
      const project = this.projectsRepository.create(projectData);
      await this.projectsRepository.save(project);
      return project;
    }

    async update(projectId: string, updateData: any): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { uuid: projectId },
      relations: ['interest'], // au cas où tu veux voir l’intérêt actuel
    });

    if (!project) {
      throw new NotFoundException(`Projet avec l'ID ${projectId} introuvable`);
    }

    if (updateData.interest) {
      const interest = await this.interestsRepository.findOne({
        where: { name: updateData.interest },
      });

      if (!interest) {
        const allInterests = await this.interestsRepository.find();
        const available = allInterests.map(i => i.name).join(', ');
        throw new NotFoundException(
          `Le centre d'intérêt "${updateData.interest}" est introuvable. ` +
          `Centres disponibles : ${available}`
        );
      }

      project.interest = interest;
    }

    // Évite les conflits : supprime manuellement tout champ erroné
    delete updateData.interest;
    delete updateData.interestId;

    // Mettre à jour les autres champs s’il y en a
    Object.assign(project, updateData);

    return await this.projectsRepository.save(project);
  }

    // Supprimer un projet
    async remove(uuid: string): Promise<void> {
      const project = await this.findById(uuid);
      if (!project) {
        throw new BadRequestException(`Projet non trouvé avec cet ID ${uuid}`);
      }
      await this.projectsRepository.remove(project);
    }
}