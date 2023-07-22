import { NestFactory } from '@nestjs/core';
import { TelcoServiceModule } from './telco-service.module';

async function bootstrap() {
  const app = await NestFactory.create(TelcoServiceModule);
  await app.listen(3000);
}
bootstrap();
