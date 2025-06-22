import { TResult } from "@/application/helpers";
import { ITransactionSecurity } from "@/application/infra/interfaces";
import {
  CreateTransactionSecurity,
  ITransactionSecurityRepository,
  ResponseCreatedTransactionSecurity,
} from "../transaction-security-repository";
import { InternalServerError } from "@/application/errors";

export class InMemoryTransactionSecurityRepository
  implements ITransactionSecurityRepository
{
  private transactionSecurity: ITransactionSecurity[] = [];

  getTransactionSecurity(): Promise<TResult<ITransactionSecurity>> {
    throw new Error("Method not implemented.");
  }
  async getTransactionSecurityByHash(
    security_hash: string,
  ): Promise<TResult<ITransactionSecurity | null>> {
    try {
      return new Promise((resolve) => {
        const result = this.transactionSecurity.find(
          (item) => item.security_hash === security_hash,
        ) as ITransactionSecurity;

        resolve({
          success: true,
          result,
        });
      });
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
      return new Promise((resolve) => {
        this.transactionSecurity.push(data as ITransactionSecurity);

        const { security_hash } =
          this.transactionSecurity[this.transactionSecurity.length - 1];

        resolve({
          success: true,
          result: {
            security_hash,
          },
        });
      });
    } catch (error) {
      throw new InternalServerError(
        "Ooops, something went wrong on create transaction security on database",
      );
    }
  }
  async updateTransactionSecurityStatus(
    security_hash: string,
    status: "active" | "completed",
  ): Promise<TResult<string>> {
    try {
      return new Promise((resolve) => {
        const index = this.transactionSecurity.findIndex(
          (item) => item.security_hash === security_hash,
        );

        this.transactionSecurity[index] = {
          ...this.transactionSecurity[index],
          status,
        } as ITransactionSecurity;

        resolve({
          success: true,
          result: security_hash,
        });
      });
    } catch (error) {
      throw new InternalServerError(
        "Ooops, something went wrong on update transaction security status on database",
      );
    }
  }
}
