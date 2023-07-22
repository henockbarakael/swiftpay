import { NestFactory } from '@nestjs/core';
import { KafkaModuleModule } from './kafka-module.module';

async function bootstrap() {
  const app = await NestFactory.create(KafkaModuleModule);
  await app.listen(3000);
}
bootstrap();
