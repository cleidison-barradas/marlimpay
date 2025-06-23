import {
  MongoTransactionRepository,
  MongoUserRepository,
} from "@/application/infra";
import { UpdateTransactionStatusUseCase } from "../update-transaction-status-usecase";

export function makeUpdateTransactionStatusUseCase() {
  const userRepository = new MongoUserRepository();
  const transactionRepository = new MongoTransactionRepository();

  return new UpdateTransactionStatusUseCase(
    transactionRepository,
    userRepository,
  );
}
