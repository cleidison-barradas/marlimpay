export type MongoConfig = {
  uri: string;
  database: string;
  auth: {
    user: string;
    password: string;
  };
};

export const MongoConfig: MongoConfig = {
  uri: `mongodb://${process.env.MONGO_DATABASE_HOST}:${process.env.MONGO_INITDB_PORT}/${process.env.MONGO_INITDB_DATABASE}?authSource=admin`,
  database: process.env.MONGO_INITDB_DATABASE || "admin",
  auth: {
    user: process.env.MONGO_INITDB_ROOT_USERNAME || "root",
    password: process.env.MONGO_INITDB_ROOT_PASSWORD || "root",
  },
};
