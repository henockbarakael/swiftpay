import { Module } from '@nestjs/common';
import { UserModuleController } from './user-module.controller';
import { UserModuleService } from './user-module.service';

@Module({
  imports: [],
  controllers: [UserModuleController],
  providers: [UserModuleService],
})
export class UserModuleModule {}
