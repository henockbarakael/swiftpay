import { NestFactory } from '@nestjs/core';
import { DatabaseModuleModule } from './database-module.module';

async function bootstrap() {
  const app = await NestFactory.create(DatabaseModuleModule);
  await app.listen(3000);
}
bootstrap();
