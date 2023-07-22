import { Controller, Get } from '@nestjs/common';
import { WalletModuleService } from './wallet-module.service';

@Controller()
export class WalletModuleController {
  constructor(private readonly walletModuleService: WalletModuleService) {}

  @Get()
  getHello(): string {
    return this.walletModuleService.getHello();
  }
}
