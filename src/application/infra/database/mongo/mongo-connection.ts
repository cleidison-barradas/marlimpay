import Mongoose from "mongoose";
import { MongoConfig } from "@/application/config/mongo-config";
import { logger } from "@/application/lib";

export class MongoConnection {
  constructor(private readonly mongoConfig: MongoConfig) {}

  public async connect() {
    Mongoose.connection.on("connected", async () => {
      logger.info("Connection to database has been established successfully");
    });

    Mongoose.connection.on("error", async (error) => {
      logger.error(`Connection to database has been error: ${error}`);
    });

    return Mongoose.connect(this.mongoConfig.uri, {
      auth: {
        username: this.mongoConfig.auth.user,
        password: this.mongoConfig.auth.password,
      },
      dbName: this.mongoConfig.database,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
    });
  }

  public async closeConnection() {
    await Mongoose.connection.close();
  }
}
