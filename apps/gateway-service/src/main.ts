import { NestFactory } from '@nestjs/core';
import { GatewayServiceModule } from './gateway-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const app = await NestFactory.create(GatewayServiceModule)

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.KAFKA,
      options: {
        client : {
          brokers: process.env.KAFKA_BROKERS.split(',')
        },
        consumer : {
          groupId: 'gateway'
        }
      }
    }
  )
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
