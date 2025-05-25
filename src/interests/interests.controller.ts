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

    // Route pour récupérer les centres d'intérêt d'un utilisateur connecté
    @UseGuards(AuthGuard('jwt')) // Protection avec JWT
    @Get('users')
    async getInterestsByUserId(@Request() req): Promise<Interest[]> {
        return this.interestsService.findByUserId(req.user.uuid); // Récupération de l'ID de l'utilisateur à partir du token JWT
    }

    // Route pour récupérer les projets en fonction des centres d'intérêt
    @UseGuards(AuthGuard('jwt')) // Protection avec JWT
    @Get('projects/recommended')
    async getProjectsByInterest(@Request() req): Promise<Interest[]> {
        const userId = req.user.uuid; // Récupération de l'ID de l'utilisateur à partir du token JWT
        return this.interestsService.findProjectByInterests(userId);
    }

    // Route pour associer des centres d'intérêt à un utilisateur connecté
    @UseGuards(AuthGuard('jwt')) // Protection avec JWT
    @Post('users')
    async addInterestsToUser(@Request() req, @Body() interests: Partial<Interest>[]): Promise<Interest[]> {
        const userId = req.user.uuid; // Récupération de l'ID de l'utilisateur à partir du token JWT
        if (!userId) {
            throw new NotFoundException('Utilisateur non trouvé');
        }
        return this.interestsService.addInterestsToUser(userId, interests);
    }
}
