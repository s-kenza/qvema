import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: UsersRepository) {}

  // Récupérer tous les utilisateurs
  async findAll(): Promise<User[]> {
    console.log(this.usersRepository);
    return this.usersRepository.find();
  }

  // Récupérer un utilisateur par son ID
  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
  
  // Récupérer un utilisateur par son email
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  // Créer un nouvel utilisateur
  async create(userData: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }

  // Supprimer un utilisateur
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
