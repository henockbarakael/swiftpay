import { Module } from '@nestjs/common';
import { GatewayService } from './gateway-service.service';
import { GatewayController } from './gateway-service.controller';
import { DatabaseModule } from 'shared/database';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EncryptionService } from 'shared/encryption';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'gateway',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'gateway',
            brokers: process.env.KAFKA_BROKERS.split(','),
          },
          consumer: {
            groupId: 'gateway',
          },
        },
      },
    ]),
    DatabaseModule,
  ],
  controllers: [GatewayController],
  providers: [GatewayService, EncryptionService],
})
export class GatewayModule {}
