import Fastify, { FastifyInstance } from "fastify";
import fastifyRateLimit from "@fastify/rate-limit";

import { MongoConnection } from "./application/infra/database/mongo/mongo-connection";
import { HttpConfig, logger, MongoConfig } from "./application";
import { CommonHandleError } from "./application/errors";
import { routes } from "./application/routes";
import {
  authDecorator,
  transactionSecurityDecorator,
} from "./application/infra";

export class App {
  private port: number;
  private host: string;
  private server!: FastifyInstance;
  private mongoConnection!: MongoConnection;

  constructor({ host = "0.0.0.0", port = 8000 }: HttpConfig) {
    this.server = Fastify({
      loggerInstance: logger,
      disableRequestLogging: true,
    });
    this.port = port;
    this.host = host;

    this.init();
  }

  private init() {
    this.initDatabase();
    this.initPlugins();
    this.initMiddlewares();
    this.initDecorators();
    this.initRoutes();
  }

  private initPlugins() {
    this.server.register(fastifyRateLimit, {
      global: false,
    });
  }

  public getServer() {
    return this.server;
  }

  private initDecorators() {
    this.server.decorate("transactionSecurity", transactionSecurityDecorator);
    this.server.decorate("authenticate", authDecorator);
  }

  private initRoutes() {
    this.server.register(routes, { prefix: "/api" });
  }

  private initDatabase() {
    this.mongoConnection = new MongoConnection(MongoConfig);
  }

  private initMiddlewares() {
    this.server.setErrorHandler(function (error, _, reply) {
      logger.error(error);
      reply
        .status(error?.statusCode || 500)
        .send(CommonHandleError.handle(error));
    });
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

      await this.mongoConnection.createDefaultRecords();

      process.on("SIGINT", this.gracefulShutdown.bind(this));
      process.on("SIGTERM", this.gracefulShutdown.bind(this));
    } catch (error) {
      this.server.log.error(`Failed to start server: ${error}`);
      process.exit(1);
    }
  }
}
