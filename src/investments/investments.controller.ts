import { Controller, Get, Post, Body, Param, Delete, NotFoundException, UseGuards, Request, Put } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { Investment } from './entities/investment.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserRole } from 'src/enums/user-role.enum';


@Controller('investments')
export class InvestmentsController {
    constructor(private readonly investmentsService: InvestmentsService) {}

    // Route pour récupérer ses investissements
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.INVESTOR)
    @Get()
    async findAll(@Request() req): Promise<Investment[]> {
        const userId = req.user.uuid;
        return this.investmentsService.findByInvestorId(userId);
    }

    // Route pour voir les investissements d'un projet que ce soit admin investisseur ou entrepreneur (Un entrepreneur peut voir les investissements mais sur ses propres projets.)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Get('project/:uuid')
    async findByProjectId(@Param('uuid') uuid: string): Promise<Investment[]> {
        return this.investmentsService.findByProjectId(uuid);
    }
}
