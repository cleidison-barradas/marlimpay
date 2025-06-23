import Mongoose from "mongoose";

export type DirectionType = "sent" | "received";

export type TransactionStatus = "pending" | "approved" | "failed";

export interface ITransaction {
  _id?: string;
  amount: number;
  security_hash: string;
  direction: DirectionType;
  status?: TransactionStatus;
  payer_id: Mongoose.Schema.Types.ObjectId;
  receiver_id: Mongoose.Schema.Types.ObjectId;
}
