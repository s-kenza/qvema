import { Controller, Get, Post, Body, Param, Delete, NotFoundException, UseGuards, Request, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Route pour récupérer tous les utilisateurs
  @Roles('admin') // Protection avec le rôle admin
  @UseGuards(AuthGuard('jwt'), RolesGuard) // Protection avec JWT et rôle
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // Route pour récupérer un utilisateur par son ID
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Route pour récupérer un utilisateur par son email (nouvelle méthode)
  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<User | undefined> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  // Route pour créer un nouvel utilisateur
  @Post()
  async createUser(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  // Route pour supprimer un utilisateur
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':uuid')
  async deleteUser(@Param('uuid') uuid: string): Promise<{ message: string; user: User }> {
    const user = await this.usersService.findById(uuid);
    if (!user) {
      throw new NotFoundException(`User with UUID ${uuid} not found`);
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
      throw new NotFoundException(`User with ID ${userId} not found`);
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
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return this.usersService.update(userId, userData);
  }

  /********************* PROJETS *********************/

  // Route pour créer un projet
  @Roles('entrepreneur')
  @UseGuards(AuthGuard('jwt'), RolesGuard) // Protection avec JWT et rôle
  @Post('projects')
  async createProject(@Request() req, @Body() projectData: any): Promise<any> {
    const userId = req.user.uuid;
    return this.usersService.createProject(userId, projectData);
  }
}
