import { NestFactory } from '@nestjs/core';
import { CallbackServiceModule } from './callback-service.module';

async function bootstrap() {
  const app = await NestFactory.create(CallbackServiceModule);
  app.enableCors();
  await app.listen(3700);
}
bootstrap();
