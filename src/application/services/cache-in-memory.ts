import { sha1 } from "js-sha1";
import { InternalServerError } from "../errors";
import { ICacheService, Transaction } from "../infra";
import { da } from "@faker-js/faker";

type CacheData = {
  data: string;
  expiration: Date;
};

export class InMemoryCacheService implements ICacheService {
  cachePrefix = "transaction";
  private cache: Map<string, CacheData> = new Map([]);

  getKey(sulfix: string): string {
    const key = `${this.cachePrefix}:${sulfix}`;

    return key;
  }
  setRateLimit(userId: string): Promise<void> {
    try {
      return new Promise((resolve) => {
        let cached = this.cache.get(this.getKey(userId));

        if (cached) {
          cached.data = (Number(cached.data) + 1).toString();
          this.cache.set(this.getKey(userId), cached);
          resolve();
        }

        const now = new Date();
        const expiration = new Date(now.setMinutes(now.getMinutes() + 1));

        this.cache.set(this.getKey(userId), {
          expiration,
          data: Number(1).toString(),
        });
        resolve();
      });
    } catch (error) {
      throw new InternalServerError(
        "Ooops, something went wrong on set rate limit on cache",
      );
    }
  }
  async getRateLimit(userId: string): Promise<number> {
    try {
      return new Promise((resolve) => {
        const cached = this.cache.get(this.getKey(userId));

        if (!cached) {
          resolve(0);
        }

        if (cached && cached.expiration < new Date()) {
          this.cache.delete(this.getKey(userId));
          resolve(0);
        }

        if (cached && cached.expiration > new Date()) {
          resolve(Number(cached.data));
        }
      });
    } catch (error) {
      throw new InternalServerError(
        "Ooops, something went wrong on get rate limit on cache",
      );
    }
  }
  async getHashData({
    payer_id,
    receiver_id,
    amount,
  }: Transaction): Promise<string | null> {
    try {
      return new Promise((resolve) => {
        const cached = this.cache.get(this.getKey(payer_id));

        if (!cached) {
          resolve(null);
        }

        if (cached && cached.expiration < new Date()) {
          this.cache.delete(this.getKey(payer_id));
          resolve(null);
        }

        const data = this.getKey(
          `${sha1(payer_id + sha1(receiver_id + sha1(amount.toString())))}`,
        );

        if (cached && cached.data !== data) {
          resolve(null);
        }

        resolve(cached?.data || data);
      });
    } catch (error) {
      throw new InternalServerError(
        "Ooops, something went wrong on get hash data on cache",
      );
    }
  }
  async setHashData({
    receiver_id,
    payer_id,
    amount,
  }: Transaction): Promise<void> {
    try {
      const data = this.getKey(
        `${sha1(payer_id + sha1(receiver_id + sha1(amount.toString())))}`,
      );

      return new Promise((resolve) => {
        const now = new Date();
        const expiration = new Date(now.setMinutes(now.getMinutes() + 1));

        this.cache.set(this.getKey(payer_id), {
          expiration,
          data,
        });
        resolve();
      });
    } catch (error) {
      throw new InternalServerError(
        "Ooops, something went wrong on set hash data on cache",
      );
    }
  }
}
