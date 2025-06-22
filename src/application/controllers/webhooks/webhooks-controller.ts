import { FastifyReply, FastifyRequest } from "fastify";

export class WebHookController {
  async handleWebhook(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(200).send();
  }
}
