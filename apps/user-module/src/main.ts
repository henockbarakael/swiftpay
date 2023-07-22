import { NestFactory } from '@nestjs/core';
import { UserModuleModule } from './user-module.module';

async function bootstrap() {
  const app = await NestFactory.create(UserModuleModule);
  await app.listen(3000);
}
bootstrap();
