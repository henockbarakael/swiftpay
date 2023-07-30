import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification-service.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);
  const configService = app.get(ConfigService)
  await app.startAllMicroservices();
  console.log(`NotificationService->port: ${configService.get('NOTIFICATION_MICROSERVICE_PORT')}`)
  await app.listen(configService.get('NOTIFICATION_MICROSERVICE_PORT'))
}
bootstrap();
