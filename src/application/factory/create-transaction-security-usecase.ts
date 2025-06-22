import { ITransactionSecurityRepository } from "../infra";
import { CreateTransactionSecurityDTO } from "../dtos";
import { IdempotencyError } from "../errors";
import { hashTransaction } from "../helpers";

export class CreateTransactionSecurityUseCase {
  constructor(
    private readonly transactionSecurityRepository: ITransactionSecurityRepository,
  ) {}

  async execute({
    amount,
    payer_id,
    receiver_id,
  }: CreateTransactionSecurityDTO) {
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
