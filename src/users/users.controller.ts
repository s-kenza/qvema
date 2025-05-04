import { Controller, Get, Post, Body, Param, Delete, NotFoundException, UseGuards, Request, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Route pour récupérer tous les utilisateurs
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
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.usersService.remove(id);
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
}
