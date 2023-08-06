import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'apps/management-service/src/auth/constants';
import { IUserResponse } from 'shared/types';

@Injectable()
export class AuthUtilsService {
    constructor( private jwtService: JwtService,
        private configService: ConfigService){}
    generateJWT(user: Partial<IUserResponse>) {
        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + 60);
        return this.jwtService.sign(
          {
            id: user.id,
            exp: exp.getTime() / 1000,
            email: user.email,
          },
          {
            secret: jwtConstants.secret,
          },
        );
      }
      getUserAuth(payload: IUserResponse): IUserResponse {
        try {
          const response: IUserResponse = {
            user: {
              id: payload.id,
              email: payload.email,
              role: payload.userRoles,
              isActive: payload.isActive,
              ...payload
            },
            access_token: this.generateJWT(payload),
          } as unknown as IUserResponse;
          return response;
        } catch (error) {
        } finally {
        }
      }
}
