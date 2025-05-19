import { Controller, Get, Post, Body, Param, Delete, NotFoundException, UseGuards, Request, Put } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // Route pour récupérer tous les projets
  @UseGuards(AuthGuard('jwt'), RolesGuard) // Protection avec JWT et rôle
  @Get()
  async getAllProjects(): Promise<Project[]> {
    return this.projectsService.findAll();
  }
}
