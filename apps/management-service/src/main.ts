import { NestFactory } from '@nestjs/core';
import { ManagementServiceModule } from './management-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ManagementServiceModule);
  console.log('Management Micro-service')
  await app.listen(3000);
}
bootstrap();
