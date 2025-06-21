import Mongoose from "mongoose";
import { ITransaction } from "@/application/infra/interfaces/transaction-interface";
import { BaseModel } from "./internals/base-model";

export class TransactionModel extends BaseModel<ITransaction> {
  constructor() {
    super("transactions");

    this.configureSchema({
      amount: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        required: true,
        enum: ["sent", "received"],
      },
      status: {
        type: String,
        required: true,
        default: "pending",
        enum: ["pending", "approved", "failed"],
      },
      payer_id: {
        type: Mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users",
      },
      receiver_id: {
        type: Mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users",
      },
    });
  }
}
