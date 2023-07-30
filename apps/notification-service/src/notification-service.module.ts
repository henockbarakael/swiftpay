import { Module } from '@nestjs/common';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'notification',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'notification',
            brokers: [
              '161.35.161.18:9092',
              '161.35.168.245:9092',
              '161.35.165.31:9092',
            ],
          },
          consumer: {
            groupId: 'notification',
          },
        },
      },
    ]),
  ],
  controllers: [NotificationServiceController],
  providers: [NotificationServiceService],
})
export class NotificationServiceModule {}
