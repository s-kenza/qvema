import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from 'src/enums/user-role.enum';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';

@Roles(UserRole.ADMIN) // Appliquer à tout le contrôleur
@UseGuards(AuthGuard('jwt'), RolesGuard) // Protection avec JWT et rôles
@Controller(UserRole.ADMIN)
export class AdminController {
    @Get()
    getAdminDashboard() {
        return { message: 'Bienvenue sur le Dashboard Admin' };
    }

    @Roles('superadmin') // Seul un superadmin peut voir ça
    @Get('settings')
    getAdminSettings() {
        return { message: 'Paramètres administrateur' };
    }
}