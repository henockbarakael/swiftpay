import { Module } from '@nestjs/common';
import { GatewayService } from './gateway-service.service';
import { TelcoServiceModule } from '../../telco-service/src/telco-service.module'; // Ajout de l'importation du module TelcoServiceModul
import { GatewayController } from './gateway-service.controller';
import { DatabaseModule } from 'shared/database';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EncryptionService } from 'shared/encryption';
import { ConfigService } from '@nestjs/config';
import { WalletService } from 'shared/wallet';

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
    TelcoServiceModule, // Ajout du module TelcoServiceModule ici
  ],
  controllers: [GatewayController],
  providers: [GatewayService, EncryptionService, ConfigService, WalletService],
})
export class GatewayModule {}
