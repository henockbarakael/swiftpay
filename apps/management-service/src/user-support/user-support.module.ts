import { Module } from '@nestjs/common';
import { UserSupportService } from './user-support.service';
import { UserSupportController } from './user-support.controller';

@Module({
  controllers: [UserSupportController],
  providers: [UserSupportService],
})
export class UserSupportModule {}
