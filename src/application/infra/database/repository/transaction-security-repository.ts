import { TResult } from "@/application/helpers";
import { ITransactionSecurity } from "../../interfaces";

export type CreateTransactionSecurity = {
  security_hash: string;
  generated_at: Date;
};

export type ResponseCreatedTransactionSecurity = {
  security_hash: string;
};

export interface ITransactionSecurityRepository {
  getTransactionSecurity(): Promise<TResult<ITransactionSecurity>>;
  getTransactionSecurityByHash(
    security_hash: string,
  ): Promise<TResult<ITransactionSecurity | null>>;
  createTransactionSecurity(
    data: CreateTransactionSecurity,
  ): Promise<TResult<ResponseCreatedTransactionSecurity>>;
  updateTransactionSecurityStatus(
    security_hash: string,
    status: "active" | "completed",
  ): Promise<TResult<string>>;
}
