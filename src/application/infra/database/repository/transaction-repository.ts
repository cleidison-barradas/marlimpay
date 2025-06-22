import { TResult } from "@/application/helpers";
import { ITransaction } from "../../interfaces/transaction-interface";

export type CreateTransaction = {
  amount: number;
  payer_id: string;
  receiver_id: string;
  security_hash: string;
};

export interface ITransactionRepository {
  createOne(data: CreateTransaction): Promise<TResult<ITransaction>>;
  getTransactionById(
    transaction_id: string,
  ): Promise<TResult<ITransaction | null>>;
  listTransactionsByUserId(userId: string): Promise<TResult<ITransaction[]>>;
}
