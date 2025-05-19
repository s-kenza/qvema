  // src/projects/projects.repository.ts
  import { AppDataSource } from '../config/datasource';
  import { Project } from './entities/project.entity';
  import { Repository } from 'typeorm';

  export const ProjectsRepository = AppDataSource.getRepository(Project).extend({
    findById(this: Repository<Project>, uuid: string) {
      return this.createQueryBuilder('project')
        .where('project.uuid = :uuid', { uuid })
        .getOne();
    }
  });