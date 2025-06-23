import { UpdateTransactionStatusDTO } from "@/application/dtos";
import { HTTP_STATUS_CODE } from "@/application/errors";
import { makeUpdateTransactionStatusUseCase } from "@/application/factory/make/make-update-transaction-status-usecase";
import { FastifyReply, FastifyRequest } from "fastify";

export class WebHookController {
  async handleWebhook(
    request: FastifyRequest<{ Body: UpdateTransactionStatusDTO }>,
    reply: FastifyReply,
  ) {
    const { transaction_id, status } = request.body;
    const usecase = makeUpdateTransactionStatusUseCase();

    await usecase.execute({
      transaction_id,
      status,
    });

    return reply.status(HTTP_STATUS_CODE.STATUS_OK).send({
      message: "Webhook processed successfully",
    });
  }
}
