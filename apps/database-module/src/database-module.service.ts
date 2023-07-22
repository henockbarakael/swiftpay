import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseModuleService {
  getHello(): string {
    return 'Hello World!';
  }
}
