import { ITransactionRepository } from "../infra";

export class ListTransactionsByIdUserIdUseCase {
  constructor(private readonly repository: ITransactionRepository) {}

  async execute(transaction_id: string) {
    return await this.repository.listTransactionsByUserId(transaction_id);
  }
}
