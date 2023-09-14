import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import {MerchantModule} from "../merchant/merchant.module";
import {AuthUtilsModule} from "shared/auth-utils";

@Module({
  imports:[
      MerchantModule,
      AuthUtilsModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports:[AuthService]
})
export class AuthModule {}
