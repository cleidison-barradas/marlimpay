import { IKey } from "@/application/infra/interfaces/key-interface";
import { BaseModel } from "./internals/base-model";

export class KeyModel extends BaseModel<IKey> {
  constructor() {
    super("keys");

    this.configureSchema({
      name: {
        type: String,
        required: true,
      },
      privateKey: {
        type: String,
        required: true,
      },
      publicKey: {
        type: String,
        required: true,
      },
    });
  }
}
