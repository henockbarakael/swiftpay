import { Module } from '@nestjs/common';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name:'NOTIFICATION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'notification',
            brokers: process.env.KAFKA_BROKERS.split(','),
          },
          consumer: {
            groupId: process.env.KAFKA_NOTIFICATION_CONSUMER_ID,
          },
        },
      },
    ]),
    MailModule,
  ],
  controllers: [NotificationServiceController],
  providers: [NotificationServiceService],
})
export class NotificationServiceModule {}
