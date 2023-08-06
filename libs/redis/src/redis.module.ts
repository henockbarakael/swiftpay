import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        username: configService.get<string>('REDIS_USERNAME'),
        password: configService.get<string>('REDIS_PASSWORD'),
        ttl: configService.get<number>('REDIS_TTL'),
      }),
      // isGlobal: true,
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
