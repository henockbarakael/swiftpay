import { Controller, Get } from '@nestjs/common';
import { KafkaModuleService } from './kafka-module.service';

@Controller()
export class KafkaModuleController {
  constructor(private readonly kafkaModuleService: KafkaModuleService) {}

  @Get()
  getHello(): string {
    return this.kafkaModuleService.getHello();
  }
}
