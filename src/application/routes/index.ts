import { FastifyInstance } from "fastify";
import { RouteAdapter } from "@/application/adapters";
import {
  TransactionSecurityController,
  transactionSecurityRouteAdapter,
  UserRouteAdpater,
  UsersController,
} from "../controllers";
import { TransactionRouteAdapter } from "../controllers/transactions/transaction-route-adapter";
import { TransactionsController } from "../controllers/transactions/transactions-controller";

export function routes(server: FastifyInstance) {
  const routes: RouteAdapter[] = [
    new UserRouteAdpater(new UsersController()),
    new TransactionRouteAdapter(new TransactionsController()),
    new transactionSecurityRouteAdapter(new TransactionSecurityController()),
  ];

  routes.forEach((route) => {
    server.register(route.initializeRoutes.bind(route));
  });
}
