import { FastifyInstance } from "fastify";
import { RouteAdapter } from "@/application/adapters";
import { TransactionsController } from "./transactions-controller";

export class TransactionRouteAdapter extends RouteAdapter {
  constructor(private readonly controller: TransactionsController) {
    super("/transactions");
  }

  initializeRoutes(instance: FastifyInstance): void {
    instance.route({
      url: this.path,
      method: "POST",
      handler: this.controller.create,
      config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
      preHandler: [instance.authenticate, instance.transactionSecurity],
    });

    instance.route({
      url: `${this.path}/:id`,
      method: "GET",
      handler: this.controller.getTransactionById,
      preHandler: [instance.authenticate],
    });

    instance.route({
      url: `/users/:user_id/transactions`,
      method: "GET",
      handler: this.controller.listTransactionsByUserId,
      preHandler: [instance.authenticate],
    });
  }
}
