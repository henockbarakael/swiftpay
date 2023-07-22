import { NestFactory } from '@nestjs/core';
import { CallbackServiceModule } from './callback-service.module';

async function bootstrap() {
  const app = await NestFactory.create(CallbackServiceModule);
  await app.listen(3000);
}
bootstrap();
