import { NestFactory } from '@nestjs/core';
import { VerificationModuleModule } from './verification-module.module';

async function bootstrap() {
  const app = await NestFactory.create(VerificationModuleModule);
  await app.listen(3000);
}
bootstrap();
