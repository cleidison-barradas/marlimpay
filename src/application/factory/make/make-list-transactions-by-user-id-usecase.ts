import { MongoTransactionRepository } from "@/application/infra";
import { ListTransactionsByIdUserIdUseCase } from "../list-transactions-by-user-id-usecase";

export function makeListTransactionsByUserIdUseCase() {
  const repository = new MongoTransactionRepository();

  return new ListTransactionsByIdUserIdUseCase(repository);
}
