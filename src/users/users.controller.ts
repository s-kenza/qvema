import { Controller, Get, Post, Body, Param, Delete, NotFoundException, UseGuards, Request, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserRole } from 'src/enums/user-role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Route pour récupérer tous les utilisateurs
  @Roles(UserRole.ADMIN) // Protection avec le rôle admin
  @UseGuards(AuthGuard('jwt'), RolesGuard) // Protection avec JWT et rôle
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // Route pour supprimer un utilisateur
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':uuid')
  async deleteUser(@Param('uuid') uuid: string): Promise<{ message: string; user: User }> {
    const user = await this.usersService.findById(uuid);
    if (!user) {
      throw new NotFoundException(`User with UUID ${uuid}`);
    }
    await this.usersService.remove(uuid);
    return {
      message: 'Utilisateur supprimé avec succès',
      user: user,
    };
  }

  // Route pour consulter son profil
  @UseGuards(AuthGuard('jwt')) // Protection avec JWT
  @Get('profile')
  async getProfile(@Request() req): Promise<User> {
    const userId = req.user.uuid;
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec cet ID non trouvé : ${userId}`);
    }
    return user;
  }

  // Route pour mettre à jour son profil
  @UseGuards(AuthGuard('jwt')) // Protection avec JWT
  @Put('profile')
  async updateProfile(@Request() req, @Body() userData: Partial<User>): Promise<User> {
    const userId = req.user.uuid;
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec cet ID non trouvé : ${userId}`);
    }
    return this.usersService.update(userId, userData);
  }
}
