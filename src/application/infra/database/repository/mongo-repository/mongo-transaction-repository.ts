import { TResult } from "@/application/helpers";
import {
  ITransaction,
  TransactionStatus,
} from "@/application/infra/interfaces/transaction-interface";
import {
  CreateTransaction,
  ITransactionRepository,
} from "../transaction-repository";
import { BadRequestError } from "@/application/errors";
import { TransactionModel } from "../../mongo/models/transaction-model";
import { logger } from "@/application/lib";

const model = new TransactionModel().getModel();

export class MongoTransactionRepository implements ITransactionRepository {
  async getTransactionById(
    transaction_id: string,
  ): Promise<TResult<ITransaction | null>> {
    try {
      const result = await model.findById(transaction_id);

      return {
        success: true,
        result,
      };
    } catch (error) {
      logger.error(error);
      throw new BadRequestError(
        "Ooops, something went wrong on get transaction by id on database",
      );
    }
  }

  async listTransactionsByUserId(
    userId: string,
  ): Promise<TResult<ITransaction[]>> {
    try {
      const result = await model.find({
        $or: [{ receiver_id: userId }, { payer_id: userId }],
      });

      return {
        success: true,
        result,
      };
    } catch (error) {
      logger.error(error);
      throw new BadRequestError(
        "Ooops, something went wrong on listing transactions by user on database",
      );
    }
  }

  async createOne(data: CreateTransaction): Promise<TResult<ITransaction>> {
    try {
      const result = await model.create(data);

      return {
        success: true,
        result,
      };
    } catch (error) {
      logger.error(error);
      throw new BadRequestError(
        "Ooops, something went wrong on create transaction on database",
      );
    }
  }

  async updateTransactionStatus(
    transaction_id: string,
    status: TransactionStatus,
  ): Promise<void> {
    try {
      await model.findByIdAndUpdate(transaction_id, { status });
    } catch (error) {
      logger.error(error);
      throw new BadRequestError(
        "Ooops, something went wrong on update transaction status on database",
      );
    }
  }
}
