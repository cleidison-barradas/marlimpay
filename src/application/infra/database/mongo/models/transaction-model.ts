import Mongoose from "mongoose";
import { BaseModel } from "./internals/base-model";
import { ITransaction } from "@/application/infra/interfaces";

export class TransactionModel extends BaseModel<ITransaction> {
  constructor() {
    super("transactions");

    this.configureSchema({
      amount: {
        type: Number,
        required: true,
      },
      direction: {
        type: String,
        required: true,
        default: "sent",
        enum: ["sent", "received"],
      },
      security_hash: {
        type: String,
        required: true,
        select: false,
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
