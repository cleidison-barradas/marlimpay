import { ITransactionSecurityRepository } from "../infra";
import { createTransactionSchema, CreateTransactionSecurityDTO } from "../dtos";
import { hashTransaction, yupValidator } from "../helpers";
import { IdempotencyError } from "../errors";

export class CreateTransactionSecurityUseCase {
  constructor(
    private readonly transactionSecurityRepository: ITransactionSecurityRepository,
  ) {}

  async execute({
    amount,
    payer_id,
    receiver_id,
  }: CreateTransactionSecurityDTO) {
    await yupValidator(createTransactionSchema, {
      amount,
      payer_id,
      receiver_id,
    });

    const security_hash = hashTransaction({
      amount,
      payer_id,
      receiver_id,
    });

    const transactionSecurityExists =
      await this.transactionSecurityRepository.getTransactionSecurityByHash(
        security_hash,
      );

    if (!transactionSecurityExists.success) {
      return transactionSecurityExists;
    }

    const result = transactionSecurityExists.result;

    if (result) {
      throw new IdempotencyError(
        "Transaction cannot be created with the same identifier",
      );
    }

    return this.transactionSecurityRepository.createTransactionSecurity({
      security_hash,
      generated_at: new Date(),
    });
  }
}
