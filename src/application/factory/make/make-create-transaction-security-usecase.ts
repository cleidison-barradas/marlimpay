import { MongoTransactionSecurityRepository } from "@/application/infra/database/repository/mongo-repository/mongo-transaction-security-repository";
import { CreateTransactionSecurityUseCase } from "../create-transaction-security-usecase";

export function makeCreateTransactionSecurityUseCase() {
  const transactionSecurityRepository =
    new MongoTransactionSecurityRepository();

  return new CreateTransactionSecurityUseCase(transactionSecurityRepository);
}
