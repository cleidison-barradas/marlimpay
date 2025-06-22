import { ITransactionSecurity } from "@/application/infra/interfaces";
import { BaseModel } from "./internals/base-model";

const GENERATED_AT_EXPIRES = "10m";

export class TransactionSecurityModel extends BaseModel<ITransactionSecurity> {
  constructor() {
    super("transaction_securities");

    this.configureSchema({
      security_hash: {
        type: String,
        unique: true,
        required: true,
      },
      status: {
        type: String,
        enum: ["active", "completed"],
        default: "active",
      },
      generated_at: {
        type: Date,
        default: Date.now,
        expires: GENERATED_AT_EXPIRES,
      },
    });
  }
}
