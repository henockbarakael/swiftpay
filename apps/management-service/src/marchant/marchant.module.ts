import { Module } from '@nestjs/common';
import { MarchantService } from './marchant.service';
import { MarchantController } from './marchant.controller';

@Module({
  controllers: [MarchantController],
  providers: [MarchantService]
})
export class MarchantModule {}
