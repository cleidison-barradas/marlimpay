import awsLambdaFastify from "@fastify/aws-lambda";
import { httpConfig } from "./application";
import { App } from "./app";

const app = new App(httpConfig);
const proxy = awsLambdaFastify(app.getServer());

export const handler = async (event: any, context: any) => {
  await app.getServer().ready();

  return proxy(event, context);
};
