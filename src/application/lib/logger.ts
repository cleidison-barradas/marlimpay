import { FastifyBaseLogger } from "fastify";
import pino from "pino";

const stream = pino.transport({
  targets: [
    {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  ],
});

export const logger = pino(stream) as FastifyBaseLogger;
