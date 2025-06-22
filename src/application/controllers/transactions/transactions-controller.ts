import { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateTransactionUseCase } from "@/application/factory/make/make-create-transaction-usecase";
import { makeFindTransactionByIdUseCase } from "@/application/factory/make/make-find-transaction-by-id-usecase";
import { makeListTransactionsByUserIdUseCase } from "@/application/factory/make/make-list-transactions-by-user-id-usecase";
import { HTTP_STATUS_CODE } from "@/application/errors";
import { CreateTransactionDTO } from "@/application/dtos";

export class TransactionsController {
  async create(
    request: FastifyRequest<{ Body: CreateTransactionDTO }>,
    reply: FastifyReply,
  ) {
    const { payer_id, receiver_id, amount } = request.body;

    const security_hash = request.transaction_security_hash;

    const usecase = makeCreateTransactionUseCase();

    const response = await usecase.execute({
      amount,
      payer_id,
      receiver_id,
      security_hash,
    });

    const statusCode = response.success
      ? HTTP_STATUS_CODE.STATUS_CREATED
      : response.error.statusCode;

    return reply.code(statusCode).send(response);
  }

  async getTransactionById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;

    const usecase = makeFindTransactionByIdUseCase();

    const response = await usecase.execute(id);

    const statusCode = response.success
      ? HTTP_STATUS_CODE.STATUS_OK
      : response.error.statusCode;

    return reply.code(statusCode).send(response);
  }

  async listTransactionsByUserId(
    request: FastifyRequest<{ Params: { user_id: string } }>,
    reply: FastifyReply,
  ) {
    const { user_id } = request.params;

    const usecase = makeListTransactionsByUserIdUseCase();

    const response = await usecase.execute(user_id);

    const statusCode = response.success
      ? HTTP_STATUS_CODE.STATUS_OK
      : response.error.statusCode;

    return reply.code(statusCode).send(response);
  }
}
