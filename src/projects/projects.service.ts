import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: typeof ProjectsRepository,
    private readonly logger: Logger) {}

    // Consulter un projet par ID
    async findById(uuid: string): Promise<Project | null> {
      return this.projectsRepository.findById(uuid);
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

    // Mettre à jour un projet
    async update(uuid: string, projectData: Partial<Project>): Promise<Project> {
      // Ignorer le champ createdAt s'il est présent
      if (projectData.createdAt) {
        delete projectData.createdAt;
        this.logger.warn('La date de création ne peut pas être modifiée. Cette valeur sera ignorée.');
      }

      // Message d'erreur s'il n'y a rien de renseigné ou uniquement createdAt
      if (Object.keys(projectData).length === 0) {
        throw new BadRequestException('Aucune donnée valide à mettre à jour');
      }

      const project = await this.findById(uuid);
      if (!project) {
        throw new BadRequestException(`Projet non trouvé avec cet ID ${uuid}`);
      }
      Object.assign(project, projectData);
      await this.projectsRepository.save(project);
      return project;
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