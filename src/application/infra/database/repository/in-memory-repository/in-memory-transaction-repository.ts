import { TResult } from "@/application/helpers";
import { ITransaction } from "@/application/infra/interfaces/transaction-interface";
import {
  CreateTransaction,
  ITransactionRepository,
} from "../transaction-repository";
import { BadRequestError } from "@/application/errors";

export class InMemoryTransactionRepository implements ITransactionRepository {
  private transactions: ITransaction[] = [];

  async createOne(data: CreateTransaction): Promise<TResult<ITransaction>> {
    try {
      return new Promise((resolve) => {
        this.transactions.push({
          ...data,
        } as any);

        const result = this.transactions[
          this.transactions.length - 1
        ] as ITransaction;

        resolve({
          result,
          success: true,
        });
      });
    } catch (error) {
      throw new BadRequestError(
        "Ooops, something went wrong on create transaction on database",
      );
    }
  }
  async getTransactionById(
    transaction_id: string,
  ): Promise<TResult<ITransaction | null>> {
    try {
      return new Promise((resolve) => {
        const result = this.transactions.find(
          (transaction) => transaction._id === transaction_id,
        ) as ITransaction;

        resolve({
          result,
          success: true,
        });
      });
    } catch (error) {
      throw new BadRequestError(
        "Ooops, something went wrong on get transaction by id on database",
      );
    }
  }
  async listTransactionsByUserId(
    userId: string,
  ): Promise<TResult<ITransaction[]>> {
    try {
      const result = this.transactions.filter(
        (transaction) =>
          String(transaction.payer_id) === userId ||
          String(transaction.receiver_id) === userId,
      );

      return {
        success: true,
        result,
      };
    } catch (error) {
      throw new BadRequestError(
        "Ooops, something went wrong on listing transactions by user on database",
      );
    }
  }
}
