import { FastifyInstance } from "fastify";
import { RouteAdapter } from "@/application/adapters";
import { UserRouteAdpater, UsersController } from "../controllers";

export function routes(server: FastifyInstance) {
  const routes: RouteAdapter[] = [new UserRouteAdpater(new UsersController())];

  routes.forEach((route) => {
    server.register(route.initializeRoutes.bind(route));
  });
}
