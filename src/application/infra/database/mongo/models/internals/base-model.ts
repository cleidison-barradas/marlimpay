import Mongoose from "mongoose";

export abstract class BaseModel<T> {
  private schemaName: string;
  private model!: Mongoose.Model<T>;

  constructor(schemaName: string) {
    this.schemaName = schemaName;
  }

  public getModel() {
    return this.model;
  }

  public configureSchema(schemaDefinition: Mongoose.SchemaDefinition) {
    const schema = new Mongoose.Schema(schemaDefinition);

    schema.set("timestamps", true);
    schema.set("versionKey", false);

    if (!Mongoose.models[this.schemaName]) {
      this.model = Mongoose.model<T>(this.schemaName, schema);
    }
  }
}
