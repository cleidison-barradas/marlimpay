import { FastifyReply, FastifyRequest } from "fastify";
import { MongoTransactionSecurityRepository } from "../database/repository/mongo-repository/mongo-transaction-security-repository";
import {
  BadRequestError,
  IdempotencyError,
  UnauthorizedError,
} from "@/application/errors";
import { CreateTransactionDTO } from "@/application/dtos";
import { hashTransaction } from "@/application/helpers";

export default async (
  request: FastifyRequest<{ Body: CreateTransactionDTO }>,
  _: FastifyReply,
) => {
  const transaction_security_hash = request.headers["idempotency-key"] as
    | string
    | null;

  if (!transaction_security_hash) {
    throw new UnauthorizedError(
      "Idempotency-Key header is required for this request.",
    );
  }

  const { payer_id, receiver_id, amount } = request.body;

  if (!payer_id || !receiver_id || !amount) {
    throw new BadRequestError(
      "Payer ID, receiver ID, and amount are required to process the transaction.",
    );
  }

  const current_transaction_hash = hashTransaction({
    amount,
    payer_id,
    receiver_id,
  });

  if (current_transaction_hash !== transaction_security_hash) {
    throw new BadRequestError(
      "The security hash does not match the transaction data.",
    );
  }
  const repository = new MongoTransactionSecurityRepository();

  const response = await repository.getTransactionSecurityByHash(
    transaction_security_hash,
  );

  const transaction_security = response.success ? response.result : null;

  if (!transaction_security) {
    throw new BadRequestError("This transaction security hash does not exist.");
  }

  const { status, security_hash } = transaction_security;

  if (status === "completed") {
    throw new IdempotencyError(
      "This transaction has already been completed and cannot be processed again.",
    );
  }

  request.transaction_security_hash = security_hash;
};
