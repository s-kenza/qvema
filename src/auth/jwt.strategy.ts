import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(configService: ConfigService) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: configService.get<string>('JWT_SECRET') ?? 'defaultSecretKey',
        });
    }      

    async validate(payload: any) {
        console.log('Payload:', payload); // Log the payload for debugging
        return { uuid: payload.sub, email: payload.email, role: payload.role };
    }      
}
