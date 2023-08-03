import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);
  const configService = app.get(ConfigService);


  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.KAFKA,
      options: {
        client : {
          brokers:  configService.get('KAFKA_BROKERS').split(',')
        },
        consumer : {
          groupId:  configService.get('KAFKA_NOTIFICATION_CONSUMER_ID')
        }
      }
    }
  )

  await app.startAllMicroservices()
  await app.listen(configService.get('NOTIFICATION_MICROSERVICE_PORT'));
}
bootstrap();
