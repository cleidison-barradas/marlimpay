import { FastifyInstance } from "fastify";

export abstract class RouteAdapter {
  protected path: string;

  constructor(path: string) {
    this.path = path;
  }

  abstract initializeRoutes(instance: FastifyInstance): void;
}
