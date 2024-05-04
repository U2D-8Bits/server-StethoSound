/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayload } from '../interfaces';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private authService: AuthService
  ) {}

  async canActivate( context: ExecutionContext,): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if(!token){
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,{ secret: process.env.JWT_SEED }
      );

      const user = await this.authService.findUserByID(payload.id);
      if( !user ) throw new UnauthorizedException('Usuario no existe');

      if( !user.isActive ) throw new UnauthorizedException('Usuario inactivo'); 

      // lanzamos error si el usuario tiene de rol user
      if( user.roles.includes('user')) throw new UnauthorizedException('No tienes permisos');

      request['user'] = user;
    
    } catch (error) {

      // Enviamos el mensaje dependiendo de lo que obtuvimos en el try
      if(error.message === 'Usuario no existe'){
        throw new UnauthorizedException('Usuario no existe');
      } else if(error.message === 'Usuario inactivo'){
        throw new UnauthorizedException('Usuario inactivo');
      } else if(error.message === 'No tienes permisos'){
        throw new UnauthorizedException('No tienes permisos');
      } else {
        throw new UnauthorizedException('Token invalido');
      } 

    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

}
