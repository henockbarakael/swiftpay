import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway-service.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');

  // on configure les pipe
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  app.enableCors({ origin: '*' });
  // on calcule le temps d'execution des chaque requete afin d'en optimiser si possible

  // on configure Swagger Open Api
  const config = new DocumentBuilder()
    .setTitle('Gatway Module')
    .setDescription('Open API of Gatway Module APP')
    .setVersion('1.0')
    .addTag('default')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: configService.get('KAFKA_BROKERS').split(','),
      },
      consumer: {
        groupId: 'gateway',
      },
    },
  });
  await app.startAllMicroservices();
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
