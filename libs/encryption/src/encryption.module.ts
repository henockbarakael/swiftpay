import { EncryptionService } from 'shared/encryption/encryption.service';
import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [EncryptionService],
  exports: [EncryptionService],
  imports: [ConfigModule.forRoot({})],
})
export class EncryptionModule {}
