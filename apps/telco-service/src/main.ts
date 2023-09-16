import { NestFactory } from '@nestjs/core';
import { TelcoServiceModule } from './telco-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(TelcoServiceModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: configService.get('KAFKA_BROKERS').split(','),
      },
      consumer: {
        groupId: 'telco',
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3020);
}
bootstrap();
