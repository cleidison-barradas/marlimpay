import Fastify, { FastifyInstance } from "fastify";
import { MongoConnection } from "./application/infra/database/mongo/mongo-connection";
import { MongoConfig } from "./application/config/mongo-config";
import { HttpConfig, logger } from "./application";

export class App {
  private port: number;
  private host: string;
  private server!: FastifyInstance;
  private mongoConnection!: MongoConnection;

  constructor({ host = "0.0.0.0", port = 8000 }: HttpConfig) {
    this.server = Fastify({ loggerInstance: logger });
    this.port = port;
    this.host = host;

    this.init();
  }

  private init() {
    this.initDatabase();
  }

  private initDatabase() {
    this.mongoConnection = new MongoConnection(MongoConfig);
  }

  private gracefulShutdown(signal: NodeJS.Signals) {
    this.mongoConnection.closeConnection().then(() => {
      this.server.log.info(`Received ${signal}. Shutting down gracefully...`);
      this.server.close(() => {
        this.server.log.info("Server closed gracefully.");
        process.exit(0);
      });
    });
  }

  public async start() {
    try {
      await this.server.listen({ host: this.host, port: this.port });

      await this.mongoConnection.connect();

      process.on("SIGINT", this.gracefulShutdown.bind(this));
      process.on("SIGTERM", this.gracefulShutdown.bind(this));
    } catch (error) {
      this.server.log.error(`Failed to start server: ${error}`);
      process.exit(1);
    }
  }
}
