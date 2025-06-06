import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from 'src/enums/user-role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: { firstname: string, lastname: string, email: string; password: string, role: UserRole }) {
    return this.authService.register(body.firstname, body.lastname, body.email, body.password, body.role);
  }
}