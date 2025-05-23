import { Global, Logger, Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken, getDataSourceToken } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { DataSource } from 'typeorm';
import { ProjectsRepository } from './projects.repository';
import { InterestsModule } from 'src/interests/interests.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), InterestsModule],
  controllers: [ProjectsController],
  providers: [
    {
      provide: getRepositoryToken(Project),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource.getRepository(Project).extend(ProjectsRepository);
      },
    },
    ProjectsService,
    Logger
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
