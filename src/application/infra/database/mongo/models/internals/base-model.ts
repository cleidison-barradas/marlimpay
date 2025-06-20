import Mongoose from "mongoose";
import MongoosePaginate from "mongoose-paginate-v2";

export abstract class BaseModel<T extends Mongoose.Document> {
  private schemaName: string;
  private model!: Mongoose.PaginateModel<T>;

  constructor(schemaName: string) {
    this.schemaName = schemaName;
  }

  public getModel() {
    return this.model;
  }

  public configureSchema(schemaDefinition: Mongoose.SchemaDefinition<T>) {
    const schema = new Mongoose.Schema<T>(schemaDefinition);

    schema.plugin(MongoosePaginate);

    schema.set("timestamps", true);
    schema.set("versionKey", false);

    if (!Mongoose.models[this.schemaName]) {
      this.model = Mongoose.model<T, Mongoose.PaginateModel<T>>(
        this.schemaName,
        schema,
        this.schemaName,
      );
    }
  }
}
