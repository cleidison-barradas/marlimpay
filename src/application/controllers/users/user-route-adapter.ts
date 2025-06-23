import { FastifyInstance } from "fastify";
import { RouteAdapter } from "@/application/adapters";
import { UsersController } from "./users-controller";

export class UserRouteAdpater extends RouteAdapter {
  constructor(private readonly controller: UsersController) {
    super("/users");
  }

  initializeRoutes(instance: FastifyInstance): void {
    instance.route({
      url: `${this.path}/:id`,
      method: "GET",
      handler: this.controller.getById,
      preHandler: [instance.authenticate],
    });

    instance.route({
      url: this.path,
      method: "POST",
      handler: this.controller.create,
      preHandler: [instance.authenticate],
    });

    instance.route({
      url: `${this.path}/:id`,
      method: "PUT",
      handler: this.controller.update,
      preHandler: [instance.authenticate],
    });
  }
}
