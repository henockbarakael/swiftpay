import { Module } from '@nestjs/common';
import { GatewayServiceController } from './gateway-service.controller';
import { GatewayServiceService } from './gateway-service.service';
import { VerificationModule } from './verification/verification.module';

@Module({
  controllers: [GatewayServiceController],
  providers: [GatewayServiceService],
  imports: [VerificationModule],
})
export class GatewayServiceModule {}
