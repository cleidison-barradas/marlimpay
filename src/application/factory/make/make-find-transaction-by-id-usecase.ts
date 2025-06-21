import { MongoTransactionRepository } from "@/application/infra";
import { FindTransactionByIdUseCase } from "../find-transaction-by-id-usecase";

export function makeFindTransactionByIdUseCase() {
  const repository = new MongoTransactionRepository();

  return new FindTransactionByIdUseCase(repository);
}
