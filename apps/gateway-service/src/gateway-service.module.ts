import { Module } from '@nestjs/common';
import { GatewayServiceController } from './gateway-service.controller';
import { GatewayServiceService } from './gateway-service.service';
import { VerificationModule } from './verification/verification.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [VerificationModule, AuthModule],
  controllers: [GatewayServiceController],
  providers: [GatewayServiceService],
})
export class GatewayServiceModule {}
