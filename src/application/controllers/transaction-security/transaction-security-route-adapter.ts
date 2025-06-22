import { RouteAdapter } from "@/application/adapters";
import { FastifyInstance } from "fastify";
import { TransactionSecurityController } from "./transaction-security-controller";

export class transactionSecurityRouteAdapter extends RouteAdapter {
  constructor(private readonly controller: TransactionSecurityController) {
    super("/transaction-security");
  }
  initializeRoutes(instance: FastifyInstance): void {
    instance.route({
      url: this.path,
      method: "POST",
      handler: this.controller.create,
    });
  }
}
