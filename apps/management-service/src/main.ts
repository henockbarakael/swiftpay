import { NestFactory } from '@nestjs/core';
import { ManagementServiceModule } from './management-service.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ManagementServiceModule);
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
    .setTitle('Management Module')
    .setDescription('Open API of Management Micro-service')
    .setVersion('1.0')
    .addTag('default')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  console.log('Management Micro-service');
  await app.listen(3500);
}
bootstrap();
