import { NestFactory } from '@nestjs/core';
import { TelcoServiceModule } from './telco-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TelcoServiceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client : {
          brokers: process.env.KAFKA_BROKERS.split(',')
        },
        consumer : {
          groupId: 'telco'
        }
      }
    }
  )
  await app.listen();
}
bootstrap();
