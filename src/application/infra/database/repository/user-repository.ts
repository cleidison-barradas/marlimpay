import { TResult } from "@/application/helpers";
import { IUser } from "../../interfaces/user-interface";

export type CreateUser = {
  name: string;
  email: string;
  balance: number;
};

export type UpdateUser = {
  name: string;
  email: string;
};

export interface IUserRepository {
  createOne(data: CreateUser): Promise<TResult<IUser>>;
  findById(id: string): Promise<TResult<IUser | null>>;
  findByEmail(
    email: string,
    excludeOwnerUserId?: string,
  ): Promise<TResult<IUser | null>>;
  updateOne(id: string, data: UpdateUser): Promise<TResult<IUser>>;
}
