
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'apps/gateway-service/src/auth/constants';
import { IUserResponse } from 'shared/types';

export class AuthHelpers {
  private jwtService: JwtService;
  private configService: ConfigService
  private static instance = null;
  constructor() {
    this.jwtService = new JwtService();
    this.configService = new ConfigService()
  }
  static getInstance() {
    if (AuthHelpers.instance === null) {
      AuthHelpers.instance = new AuthHelpers();
    }
    return AuthHelpers.instance;
  }
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

  renderUserResponse(payload: Partial<IUserResponse>): IUserResponse {
    try {
      const response: IUserResponse = {
        user: {
          id: payload.id,
          email: payload.email,
          role: payload.userRoles,
          isActive: payload.isActive,
        },
        access_token: this.generateJWT(payload),
      } as unknown as IUserResponse;
      return response;
    } catch (error) {
    } finally {
    }
  }
}
