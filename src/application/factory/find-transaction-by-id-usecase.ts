import { NotFoundError } from "../errors";
import { ITransactionRepository } from "../infra";

export class FindTransactionByIdUseCase {
  constructor(private readonly repository: ITransactionRepository) {}

  async execute(transaction_id: string) {
    let response = await this.repository.getTransactionById(transaction_id);

    const transaction = response.success ? response.result : null;

    if (!transaction) {
      throw new NotFoundError("Transaction not found");
    }

    return response;
  }
}
