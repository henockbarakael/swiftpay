import { Injectable } from '@nestjs/common';

@Injectable()
export class WalletModuleService {
  getHello(): string {
    return 'Hello World!';
  }
}
