import { IUser } from "@/application/infra/interfaces/user-interface";
import { BaseModel } from "./internals/base-model";

export class UserModel extends BaseModel<IUser> {
  constructor() {
    super("users");

    this.configureSchema({
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        unique: true,
        required: true,
      },
      balance: {
        type: Number,
        required: true,
      },
      access_token: {
        type: String,
        select: false,
      },
    });
  }
}
