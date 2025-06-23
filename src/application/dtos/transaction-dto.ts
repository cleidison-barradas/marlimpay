import { TransactionStatus } from "../infra";

export type CreateTransactionDTO = {
  amount: number;
  payer_id: string;
  receiver_id: string;
  security_hash: string;
};

export type UpdateTransactionStatusDTO = {
  transaction_id: string;
  status: TransactionStatus;
};
