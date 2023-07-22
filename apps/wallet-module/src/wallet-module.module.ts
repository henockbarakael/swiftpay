import { Module } from '@nestjs/common';
import { WalletModuleController } from './wallet-module.controller';
import { WalletModuleService } from './wallet-module.service';

@Module({
  imports: [],
  controllers: [WalletModuleController],
  providers: [WalletModuleService],
})
export class WalletModuleModule {}
