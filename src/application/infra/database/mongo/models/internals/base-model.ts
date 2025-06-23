import Mongoose from "mongoose";

export abstract class BaseModel<T> {
  private schemaName: string;
  private model!: Mongoose.Model<T>;

  constructor(schemaName: string) {
    this.schemaName = schemaName;
  }

  public getModel(): Mongoose.Model<T> {
    const model = Mongoose.models[this.schemaName];

    if (!model) {
      throw new Error(`Model ${this.schemaName} not found`);
    }

    return model;
  }

  public configureSchema(schemaDefinition: Mongoose.SchemaDefinition<T>) {
    const schema = new Mongoose.Schema(schemaDefinition);

    schema.set("timestamps", true);
    schema.set("versionKey", false);

    const model = Mongoose.model<T>(this.schemaName, schema);

    model.syncIndexes().then(() => {
      this.model = model;
    });
  }
}
