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
      preHandler: [instance.transactionSecurity],
      config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
      handler: this.controller.create,
    });

    instance.route({
      url: `${this.path}/:id`,
      method: "GET",
      handler: this.controller.getTransactionById,
    });

    instance.route({
      url: `/users/:user_id/transactions`,
      method: "GET",
      handler: this.controller.listTransactionsByUserId,
    });
  }
}
