import Mongoose from "mongoose";

type DirectionType = "sent" | "received";

type TransactionStatus = "pending" | "approved" | "failed";

export interface ITransaction {
  _id?: string;
  amount: number;
  security_hash: string;
  direction: DirectionType;
  status?: TransactionStatus;
  payer_id: Mongoose.Schema.Types.ObjectId;
  receiver_id: Mongoose.Schema.Types.ObjectId;
}
