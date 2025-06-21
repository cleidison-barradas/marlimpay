import Redis from "ioredis";
import { RedisConfig } from "@/application/config/redis-config";
import { logger } from "@/application/lib";

export class RedisConnection {
  private redisClient!: Redis;

  constructor(private readonly redisConfig: RedisConfig) {}

  public getClient() {
    return this.redisClient;
  }

  public async closeConnection() {
    await this.redisClient.quit();
  }

  async connect() {
    this.redisClient = new Redis(this.redisConfig);

    this.redisClient.on("connect", () => {
      logger.info("Connection to redis has been established successfully");
    });

    this.redisClient.on("error", (error) => {
      logger.error(`Connection to redis has been error: ${error}`);
    });
  }
}
