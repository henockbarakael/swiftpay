import { Module } from '@nestjs/common';
import { KafkaModuleController } from './kafka-module.controller';
import { KafkaModuleService } from './kafka-module.service';

@Module({
  imports: [],
  controllers: [KafkaModuleController],
  providers: [KafkaModuleService],
})
export class KafkaModuleModule {}
