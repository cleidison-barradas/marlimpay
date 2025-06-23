import { FastifyInstance } from "fastify";
import { RouteAdapter } from "@/application/adapters";
import {
  UsersController,
  TransactionsController,
  TransactionSecurityController,
  transactionSecurityRouteAdapter,
  UserRouteAdpater,
  WebHookController,
  WebhookRouteAdapter,
  TransactionRouteAdapter,
} from "../controllers";

export function routes(server: FastifyInstance) {
  const routes: RouteAdapter[] = [
    new UserRouteAdpater(new UsersController()),
    new WebhookRouteAdapter(new WebHookController()),
    new TransactionRouteAdapter(new TransactionsController()),
    new transactionSecurityRouteAdapter(new TransactionSecurityController()),
  ];

  routes.forEach((route) => {
    server.register(route.initializeRoutes.bind(route));
  });
}
