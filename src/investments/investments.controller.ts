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

    // Route pour voir les investissements d'un projet que ce soit admin investisseur ou entrepreneur (mais un entrepreneur ne peut que voir les investissements d'un projet qu'il a créé)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Get('project/:uuid')
    async findByProjectId(@Param('uuid') uuid: string, @Request() req): Promise<Investment[]> {
        const userId = req.user.uuid;
        const userRole = req.user.role;

        // Vérification si l'utilisateur est un entrepreneur et s'il est le propriétaire du projet
        if (userRole === UserRole.ADMIN || userRole === UserRole.INVESTOR) {
            return this.investmentsService.findByProjectId(uuid);
        }

        if (userRole === UserRole.ENTREPRENEUR) {
            return this.investmentsService.findByProjectIdForOwner(uuid, userId);
        }

        throw new NotFoundException('Vous n\'êtes pas autorisé à voir les investissements de ce projet');
    }

    // Route pour investir dans un projet
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.INVESTOR)
    @Post()
    async create(@Body() investmentData: Investment, @Request() req): Promise<Investment> {
        const userId = req.user.uuid;
        return this.investmentsService.createInvestment(investmentData, userId);
    }

    // Route pour supprimer un investissement
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.INVESTOR, UserRole.ADMIN)
    @Delete(':uuid')
    async remove(@Param('uuid') uuid: string, @Request() req): Promise<{ message: string, investment: Investment }> {
        const userId = req.user.uuid;
        const userRole = req.user.role;
        const investment = await this.investmentsService.findById(uuid);

        // Vérification si l'utilisateur est un investisseur ou un admin
        if (userRole === UserRole.INVESTOR || userRole === UserRole.ADMIN) {
            await this.investmentsService.removeInvestment(uuid, userId, userRole);
            return {
                message: 'Investissement supprimé avec succès',
                investment: investment
            }
        } else {
            throw new NotFoundException('Vous n\'êtes pas autorisé à supprimer cet investissement');
        }
    }
}
