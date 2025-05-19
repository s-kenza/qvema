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
}
