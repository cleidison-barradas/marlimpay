import { NotFoundError } from "../errors";
import { ITransactionRepository } from "../infra";

export class FindTransactionByIdUseCase {
  constructor(private readonly repository: ITransactionRepository) {}

  async execute(transaction_id: string) {
    let response = await this.repository.getTransactionById(transaction_id);

    if (response.success && !response.result) {
      throw new NotFoundError("Transaction not found");
    }

    return response;
  }
}
