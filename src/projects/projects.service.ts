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
}