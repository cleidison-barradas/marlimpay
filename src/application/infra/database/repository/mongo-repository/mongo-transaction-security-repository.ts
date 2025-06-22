import { TResult } from "@/application/helpers";
import { ITransactionSecurity } from "@/application/infra/interfaces";
import { TransactionSecurityModel } from "../../mongo/models/transaction-security-model";
import {
  CreateTransactionSecurity,
  ITransactionSecurityRepository,
  ResponseCreatedTransactionSecurity,
} from "../transaction-security-repository";
import { InternalServerError } from "@/application/errors";

const model = new TransactionSecurityModel().getModel();

export class MongoTransactionSecurityRepository
  implements ITransactionSecurityRepository
{
  async updateTransactionSecurityStatus(
    security_hash: string,
    status: "active" | "completed",
  ): Promise<TResult<string>> {
    try {
      await model.findOneAndUpdate({ security_hash }, { status });

      return {
        success: true,
        result: security_hash,
      };
    } catch (error) {
      throw new InternalServerError(
        "Ooops, something went wrong on update transaction security status on database",
      );
    }
  }

  async getTransactionSecurityByHash(
    security_hash: string,
  ): Promise<TResult<ITransactionSecurity | null>> {
    try {
      const result = await model.findOne({
        security_hash,
      });

      return {
        success: true,
        result,
      };
    } catch (error) {
      throw new InternalServerError(
        "Ooops, something went wrong on get transaction security by hash on database",
      );
    }
  }
  async createTransactionSecurity(
    data: CreateTransactionSecurity,
  ): Promise<TResult<ResponseCreatedTransactionSecurity>> {
    try {
      const doc = await model.create(data);

      const { security_hash } = doc;

      return {
        success: true,
        result: {
          security_hash,
        },
      };
    } catch (error) {
      throw new InternalServerError(
        "Ooops, something went wrong on create transaction security on database",
      );
    }
  }
  getTransactionSecurity(): Promise<TResult<ITransactionSecurity>> {
    throw new Error("Method not implemented.");
  }
}
