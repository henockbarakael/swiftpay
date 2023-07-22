import { Module } from '@nestjs/common';
import { DatabaseModuleController } from './database-module.controller';
import { DatabaseModuleService } from './database-module.service';

@Module({
  imports: [],
  controllers: [DatabaseModuleController],
  providers: [DatabaseModuleService],
})
export class DatabaseModuleModule {}
