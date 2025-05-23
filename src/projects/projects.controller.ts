import { Controller, Get, Post, Body, Param, Delete, NotFoundException, UseGuards, Request, Put } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserRole } from 'src/enums/user-role.enum';
import { InterestsService } from 'src/interests/interests.service';

@Controller('projects')
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly interestsService : InterestsService) {}

    // Route pour récupérer tous les projets
    @UseGuards(AuthGuard('jwt'), RolesGuard) // Protection avec JWT et rôle
    @Get()
    async getAllProjects(): Promise<Project[]> {
        return this.projectsService.findAll();
    }

    // Route pour récupérer un projet par ID
    @UseGuards(AuthGuard('jwt'), RolesGuard) // Protection avec JWT et rôle
    @Get(':uuid')
    async getProjectById(@Param('uuid') uuid: string): Promise<Project> {
        const project = await this.projectsService.findById(uuid);
        if (!project) {
            throw new NotFoundException('Projet non trouvé');
        }
        return project;
    }

    // Route pour créer un nouveau projet
    @Roles(UserRole.ENTREPRENEUR) // Protection avec le rôle entrepreneur
    @UseGuards(AuthGuard('jwt'), RolesGuard) // Protection avec JWT et rôle
    @Post()
    async createProject(@Body() projectData: Partial<Project>, @Request() req) {
        const creatorId = req.user?.uuid;
        console.log('creator: ', creatorId);

        const category = projectData.category;
        console.log('category: ', category);

        if (!category) {
            throw new NotFoundException('Catégorie (intérêt) du projet non définie');
        }

        if (!creatorId) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        // Récupérer l'id de l'intéret en fonction de son nom
        const interest = await this.interestsService.findByName(category);

        const createdProject = await this.projectsService.create({
            ...projectData,
            owner: creatorId,
            interest: interest ?? undefined,
        });
        return {
            message: 'Projet créé avec succès',
            project: createdProject,
        }
    }

    // Route pour mettre à jour un projet
    @Roles(UserRole.ENTREPRENEUR) // Protection avec le rôle entrepreneur
    @UseGuards(AuthGuard('jwt'), RolesGuard) // Protection avec JWT et rôle
    @Put(':uuid')
    async updateProject(@Param('uuid') uuid: string, @Body() projectData: Partial<Project>, @Request() req): Promise<{message: string, project : Partial<Project> }> {
        const updatedProject = await this.projectsService.update(uuid, projectData);
        if (!updatedProject) {
            throw new NotFoundException('Projet non trouvé');
        }
        // Vérifier si l'entrepreneur qui met à jour le projet est le même que celui qui l'a créé
        const creatorId = req.user?.uuid;
        console.log('creator: ', creatorId);
        console.log('project: ', updatedProject);
        if (updatedProject.owner !== creatorId) {
            throw new NotFoundException('Vous ne pouvez pas mettre à jour ce projet');
        }

        return {
            message: 'Projet mis à jour avec succès',
            project: updatedProject,
        }
    }

    // Route pour supprimer un projet
    @Roles(UserRole.ENTREPRENEUR) // Protection avec le rôle entrepreneur
    @Roles(UserRole.ADMIN) // Protection avec le rôle admin
    @UseGuards(AuthGuard('jwt'), RolesGuard) // Protection avec JWT et rôle
    @Delete(':uuid')
    async deleteProject(@Param('uuid') uuid: string): Promise<{ message: string; project: Project }> {
        const project = await this.projectsService.findById(uuid);
        if (!project) {
            throw new NotFoundException('Projet non trouvé');
        }
        await this.projectsService.remove(uuid);
        return {
            message: 'Projet supprimé avec succès',
            project: project,
        }
    }
}
