import { Module } from '@nestjs/common';
import { TelcoServiceController } from './telco-service.controller';
import { TelcoServiceService } from './telco-service.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'telco',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'telco',
            brokers: process.env.KAFKA_BROKERS.split(','),
          },
          consumer: {
            groupId: 'telco',
          },
        },
      },
    ]),
  ],
  controllers: [TelcoServiceController],
  providers: [TelcoServiceService],
})
export class TelcoServiceModule {}
