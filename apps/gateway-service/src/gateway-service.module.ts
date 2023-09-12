import { Module } from '@nestjs/common';
import { GatewayService } from './gateway-service.service';
import { GatewayController } from './gateway-service.controller';
import { DatabaseModule } from 'shared/database';

@Module({
  imports: [DatabaseModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
