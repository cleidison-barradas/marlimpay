import {
  MongoTransactionRepository,
  MongoTransactionSecurityRepository,
  MongoUserRepository,
} from "@/application/infra";
import { CreateTransactionUsecase } from "../create-transaction-usecase";

export function makeCreateTransactionUseCase() {
  const userRepository = new MongoUserRepository();
  const transactioRepository = new MongoTransactionRepository();
  const transactionSecurityRepository =
    new MongoTransactionSecurityRepository();

  return new CreateTransactionUsecase(
    transactioRepository,
    userRepository,
    transactionSecurityRepository,
  );
}
