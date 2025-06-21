import Mongoose from "mongoose";

type TransactionType = "sent" | "received";
type TransactionStatus = "pending" | "approved" | "failed";

export interface ITransaction extends Mongoose.Document {
  amount: number;
  type: TransactionType;
  status?: TransactionStatus;
  payer_id: Mongoose.Schema.Types.ObjectId;
  receiver_id: Mongoose.Schema.Types.ObjectId;
}
