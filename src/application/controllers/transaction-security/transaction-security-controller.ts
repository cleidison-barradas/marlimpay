import { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateTransactionSecurityUseCase } from "@/application/factory/make/make-create-transaction-security-usecase";
import { CreateTransactionSecurityDTO } from "@/application/dtos";
import { HTTP_STATUS_CODE } from "@/application/errors";

export class TransactionSecurityController {
  async create(
    request: FastifyRequest<{ Body: CreateTransactionSecurityDTO }>,
    reply: FastifyReply,
  ) {
    const { payer_id, receiver_id, amount } = request.body;

    const usecase = makeCreateTransactionSecurityUseCase();

    const response = await usecase.execute({
      amount,
      payer_id,
      receiver_id,
    });

    const statusCode = response.success
      ? HTTP_STATUS_CODE.STATUS_CREATED
      : response.error.statusCode;

    return reply.status(statusCode).send(response);
  }
  async findById() {}
  async findBySecurityHash() {}
}
