import { Module } from '@nestjs/common';
import { CallbackServiceController } from './callback-service.controller';
import { CallbackServiceService } from './callback-service.service';
import { WalletService } from 'shared/wallet';
import { DatabaseService } from 'shared/database';

@Module({
  imports: [],
  controllers: [CallbackServiceController],
  providers: [CallbackServiceService, WalletService, DatabaseService],
})
export class CallbackServiceModule {}
