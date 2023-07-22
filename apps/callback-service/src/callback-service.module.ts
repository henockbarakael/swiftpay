import { Module } from '@nestjs/common';
import { CallbackServiceController } from './callback-service.controller';
import { CallbackServiceService } from './callback-service.service';

@Module({
  imports: [],
  controllers: [CallbackServiceController],
  providers: [CallbackServiceService],
})
export class CallbackServiceModule {}
