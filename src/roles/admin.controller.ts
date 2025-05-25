import { Controller, Delete, Get, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from 'src/enums/user-role.enum';
import { InvestmentsService } from 'src/investments/investments.service';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Roles(UserRole.ADMIN) // Appliquer à tout le contrôleur
@UseGuards(AuthGuard('jwt'), RolesGuard) // Protection avec JWT et rôles
@Controller(UserRole.ADMIN)
export class AdminController {
    constructor(
        private readonly usersService: UsersService,
        private readonly investmentsService: InvestmentsService,
    ) {}

    // Route pour récupérer tous les utilisateurs
    @Get('users')
    async getAllUsers() {
        return this.usersService.findAll();
    }

    // Route pour récupérer toutes les transactions (investissements)
    @Get('investments')
    async getAllInvestments() {
        return this.investmentsService.findAll();
    }

    // Route pour supprimer un utilisateur
    @Delete('users/:uuid')
    async deleteUser(@Param('uuid') uuid: string) : Promise<{ message: string, user: User }> {
        const user = await this.usersService.findById(uuid);
        if (!user) {
            throw new NotFoundException(`Utilisateur avec l'ID ${uuid} non trouvé`);
        }

        await this.usersService.remove(uuid);
        return { 
            message: `Utilisateur avec l'ID ${uuid} supprimé avec succès`,
            user: user
        };
    }
}