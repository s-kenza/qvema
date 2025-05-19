import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/enums/user-role.enum';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Identifiants incorrects.');
        }
        return user;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.uuid, role: user.role };
        return { access_token: this.jwtService.sign(payload) };
    }

    async register(firstname: string, lastname: string, email: string, password: string, role: UserRole) {
        if (!firstname || !lastname) {
            throw new BadRequestException('Le nom et prénom sont obligatoires.');
        }

        if (!email || !password) {
            throw new BadRequestException(" L'email et le mot de passe sont obligatoires.");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new BadRequestException('Email invalide.');
        }
        if (password.length < 6) {
            throw new BadRequestException('Le mot de passe doit contenir au moins 6 caractères.');
        }

        // Vérification de l'existence de l'utilisateur
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new UnauthorizedException('Email déjà utilisé.');
        }
        return this.usersService.create({ firstname, lastname, email, password, role });
    }
}