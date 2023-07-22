import { Module } from '@nestjs/common';
import { VerificationModuleController } from './verification-module.controller';
import { VerificationModuleService } from './verification-module.service';

@Module({
  imports: [],
  controllers: [VerificationModuleController],
  providers: [VerificationModuleService],
})
export class VerificationModuleModule {}
