import { sha1 } from "js-sha1";
import { logger } from "../lib";
import { InternalServerError } from "../errors";
import { ICacheService, Transaction } from "../infra";
import { RedisConnection } from "../infra/database/redis";

const RATE_LIMIT_EXPIRATION = 60 * 5;
const TRANSACTION_EXPIRATION = 60 * 10;

export class CacheService implements ICacheService {
  cachePrefix = "transaction";

  constructor(private readonly redisConnection: RedisConnection) {}
  getKey(sulfix: string): string {
    const key = `${this.cachePrefix}:${sulfix}`;

    return key;
  }

  async setHashData({
    receiver_id,
    payer_id,
    amount,
  }: Transaction): Promise<void> {
    try {
      const hash = this.getKey(
        `${sha1(payer_id + sha1(receiver_id + sha1(amount.toString())))}`,
      );

      await this.redisConnection
        .getClient()
        .set(this.getKey(payer_id), hash, "EX", TRANSACTION_EXPIRATION);
    } catch (error) {
      logger.error(error);
      throw new InternalServerError(
        "Ooops, something went wrong on set hash data on cache",
      );
    }
  }
  async getHashData({ payer_id }: Transaction): Promise<string | null> {
    try {
      const data = await this.redisConnection
        .getClient()
        .get(this.getKey(payer_id));

      return data;
    } catch (error) {
      logger.error(error);
      throw new InternalServerError(
        "Ooops, something went wrong on get hash data on cache",
      );
    }
  }

  async setRateLimit(userId: string): Promise<void> {
    try {
      await this.redisConnection
        .getClient()
        .set(this.getKey(userId), "1", "EX", RATE_LIMIT_EXPIRATION);
    } catch (error) {
      logger.error(error);
      throw new InternalServerError(
        "Ooops, something went wrong on set rate limit on cache",
      );
    }
  }
  async getRateLimit(userId: string): Promise<number> {
    try {
      const requests = await this.redisConnection
        .getClient()
        .get(this.getKey(userId));

      return Number(requests || 0);
    } catch (error) {
      logger.error(error);
      throw new InternalServerError(
        "Ooops, something went wrong on get rate limit on cache",
      );
    }
  }
}
