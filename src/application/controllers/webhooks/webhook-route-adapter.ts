import { FastifyInstance } from "fastify";
import { RouteAdapter } from "@/application/adapters";
import { WebHookController } from "./webhooks-controller";

export class WebhookRouteAdapter extends RouteAdapter {
  constructor(private readonly controller: WebHookController) {
    super("/webhooks");
  }
  initializeRoutes(instance: FastifyInstance): void {
    instance.route({
      url: `${this.path}/payment-gateway`,
      method: "POST",
      handler: this.controller.handleWebhook,
    });
  }
}
