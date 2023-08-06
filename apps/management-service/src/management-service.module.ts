import { Module } from '@nestjs/common';
import { ManagementServiceController } from './management-service.controller';
import { ManagementServiceService } from './management-service.service';
import { MarchantModule } from './marchant/marchant.module';
import { DatabaseModule } from 'shared/database';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MarchantModule,
  //   AuthModule,
    DatabaseModule,
  ],
  controllers: [ManagementServiceController],
  providers: [ManagementServiceService],
})
export class ManagementServiceModule {}
