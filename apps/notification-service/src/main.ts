import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.KAFKA,
      options: {
        client : {
          brokers: process.env.KAFKA_BROKERS.split(',')
        },
        consumer : {
          groupId: 'notification'
        }
      }
    }
  )

  await app.startAllMicroservices()
  await app.listen(3002);
}
bootstrap();
