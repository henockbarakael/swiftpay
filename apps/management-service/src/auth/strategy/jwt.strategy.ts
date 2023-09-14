import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { UnauthorizedException } from '@nestjs/common';
import { IUserResponse } from 'shared/types';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService: PrismaClient) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }
  async validate(paylaod: IUserResponse): Promise<Partial<IUserResponse>> {
    try {
      const user = await this.prismaService.user.findUnique({
        where:{
          email: paylaod.email
        }
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
