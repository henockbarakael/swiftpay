import { NestFactory } from '@nestjs/core';
import { WalletModuleModule } from './wallet-module.module';

async function bootstrap() {
  const app = await NestFactory.create(WalletModuleModule);
  await app.listen(3000);
}
bootstrap();
