import { Module } from '@nestjs/common';
import { GatewayServiceController } from './gateway-service.controller';
import { GatewayServiceService } from './gateway-service.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'gateway',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'gateway',
            brokers: [
              '161.35.161.18:9092',
              '161.35.168.245:9092',
              '161.35.165.31:9092',
            ],
          },
          consumer: {
            groupId: 'gateway',
          },
        },
      },
    ]),
  ],
  controllers: [GatewayServiceController],
  providers: [GatewayServiceService],
})
export class GatewayServiceModule {}
