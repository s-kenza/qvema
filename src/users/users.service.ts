import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: typeof UsersRepository,
    private readonly logger: Logger) {}

  // Récupérer tous les utilisateurs
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // Récupérer un utilisateur par son ID
  async findById(uuid: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { uuid } });
  }

  // Récupérer un utilisateur par son email
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneByEmail(email);
  }

  // Créer un nouvel utilisateur
  async create(userData: Partial<User>): Promise<User> {
    if (userData.password != undefined) {
      userData.password = bcrypt.hashSync(userData.password, 10); // Hash le mot de passe avant de l'enregistrer
    }
    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }

  // Supprimer un utilisateur
  async remove(uuid: string): Promise<void> {
    const user = await this.findById(uuid);
    if (!user) {
      throw new BadRequestException(`User with ID ${uuid} not found`);
    }
    await this.usersRepository.remove(user);
  }

  // Mettre à jour un utilisateur
  async update(uuid: string, userData: Partial<User>): Promise<User> {
    // Ignorer le champ createdAt s'il est présent
    if (userData.createdAt) {
      delete userData.createdAt;
      this.logger.warn('La date de création ne peut pas être modifiée. Cette valeur sera ignorée.');
    }

    // Message d'erreur s'il n'y a rien de renseigné ou uniquement createdAt
    if (Object.keys(userData).length === 0) {
      throw new BadRequestException('Aucune donnée valide à mettre à jour');
    }

    // Vérifier si l'utilisateur existe
    const user = await this.findById(uuid);
    if (!user) {
      throw new Error(`User with ID ${uuid} not found`);
    }
    if (userData.password != undefined) {
      userData.password = bcrypt.hashSync(userData.password, 10); // Hash le mot de passe avant de l'enregistrer
    }

    // Vérifier le role qui doit appartenir à l'enum
    if (userData.role && !['entrepreneur', 'investor', 'admin'].includes(userData.role)) {
      throw new BadRequestException(
        `Le rôle '${userData.role}' est invalide. Les rôles autorisés sont: entrepreneur, investor, admin`
      );
    }

    Object.assign(user, userData);
    return this.usersRepository.save(user);
  }
}
