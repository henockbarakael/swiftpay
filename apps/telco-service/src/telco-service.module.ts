import { Module } from '@nestjs/common';
import { TelcoServiceController } from './telco-service.controller';
import { TelcoServiceService } from './telco-service.service';

@Module({
  imports: [],
  controllers: [TelcoServiceController],
  providers: [TelcoServiceService],
})
export class TelcoServiceModule {}
