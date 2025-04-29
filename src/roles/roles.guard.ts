import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // Récupérer les rôles définis avec @Roles()
        let requiredRoles =
               this.reflector.get<string[]>('roles', context.getHandler())
            || this.reflector.get<string[]>('roles', context.getClass());

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user; // Utilisateur récupéré via le JWT

        // Vérifier si l'utilisateur possède un rôle autorisé
        if (!user || !requiredRoles.includes(user.role)) {
            throw new ForbiddenException('Accès interdit. Rôle insuffisant.');
        }

        return true;
    }
}