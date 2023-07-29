import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get(key: string) {
    return await this.cacheManager.get(key);
  }
  async set(key: string, value: unknown, delay = 100): Promise<boolean> {
    try {
      await this.cacheManager.set(key, value, delay);
      console.log('redis cache', await this.cacheManager.get(key));
      return true;
    } catch (error) {
      throw new NotAcceptableException(error);
    }
  }
  async remove(key: string) {
    return await this.cacheManager.del(key);
  }
}
