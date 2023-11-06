import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { IUserResponse } from 'shared/types';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }
  async validate(payload: IUserResponse): Promise<Partial<IUserResponse>> {
    return (await this.authService.existUser(
      payload as unknown as LoginDto,
    )) as unknown as IUserResponse;
  }
}
