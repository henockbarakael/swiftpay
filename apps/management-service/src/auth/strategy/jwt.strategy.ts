import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { IUserResponse } from 'shared/types';
import { DatabaseService } from 'shared/database';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }
  async validate(payload: IUserResponse): Promise<Partial<IUserResponse>> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: payload.email,
        },
      });
      if (Object.keys(user)) {
        delete user.password;
        return user as unknown as IUserResponse;
      }
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
      );
    } catch (error) {}
  }
}
