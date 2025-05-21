import { Controller, Get, Post, Body, Param, Delete, NotFoundException, UseGuards, Request, Put } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { Interest } from './entities/interest.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('interests')
export class InterestsController {
    constructor(private readonly interestsService: InterestsService) {}

    // Route pour récupérer tous les centres d'intérêt
    @Get()
    async getAllInterests(): Promise<Interest[]> {
        return this.interestsService.findAll();
    }

    // Route pour récupérer les centres d'intérêt d'un utilisateur
    @UseGuards(AuthGuard('jwt')) // Protection avec JWT
    @Get('users/:id')
    async getInterestsByUserId(@Param('id') id: string): Promise<Interest[]> {
        return this.interestsService.findByUserId(id);
    }

    // Route pour récupérer les projets en fonction des centres d'intérêt
    @UseGuards(AuthGuard('jwt')) // Protection avec JWT
    @Get('projects/recommended/:id')
    async getRecommendedProjects(@Param('id') id: string): Promise<Interest[]> {
        return this.interestsService.findProjectById(id);
    }

    // Route pour associer des centres d'intérêt à un utilisateur
    // @UseGuards(AuthGuard('jwt')) // Protection avec JWT
    // @Post('users/:id')
    // async addInterestsToUser(@Param('id') id: string, @Body() interests: Partial<Interest>[]): Promise<Interest[]> {
    //     return this.interestsService.addInterestsToUser(id, interests);
    // }
}
