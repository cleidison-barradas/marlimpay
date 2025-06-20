import Mongoose from "mongoose";

export interface IUser extends Mongoose.Document {
  name: string;
  email: string;
  balance: number;
}
