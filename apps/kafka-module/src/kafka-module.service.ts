import { Injectable } from '@nestjs/common';

@Injectable()
export class KafkaModuleService {
  getHello(): string {
    return 'Hello World!';
  }
}
