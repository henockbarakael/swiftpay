import { Module } from '@nestjs/common';
import { AgregatorParameterController } from './agregator-parameter.controller';
import { AgregatorParameterService } from './agregator-parameter.service';

@Module({
  controllers: [AgregatorParameterController],
  providers: [AgregatorParameterService],
  exports: [AgregatorParameterService],
})
export class AgregatorParameterModule {}
