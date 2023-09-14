import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CurrencyModule } from './currency/currency.module';
import { DatabaseModule } from 'shared/database';

@Module({
  imports: [DatabaseModule, CurrencyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
