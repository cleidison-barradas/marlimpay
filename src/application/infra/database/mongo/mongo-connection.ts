import Mongoose from "mongoose";
import {
  DefaultUserConfig,
  MongoConfig,
} from "@/application/config/mongo-config";
import { logger } from "@/application/lib";
import { UserModel } from "./models/user-model";
import { signJwt } from "@/application/lib/jwt";

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

  public async createDefaultRecords() {
    const model = Mongoose.models["users"];

    const count = await model.countDocuments();

    if (
      count === 0 &&
      process.env.NODE_ENV === "development" &&
      DefaultUserConfig.name &&
      DefaultUserConfig.email
    ) {
      const doc = await model.create({
        name: DefaultUserConfig.name,
        email: DefaultUserConfig.email,
        balance: 1000,
      });

      const access_token = await signJwt({
        user_id: doc._id,
        email: doc.email,
      });

      await doc.updateOne({ access_token });

      logger.info(
        `Created default user: ${DefaultUserConfig.name}, email: ${DefaultUserConfig.email}`,
      );
    }
  }
}
