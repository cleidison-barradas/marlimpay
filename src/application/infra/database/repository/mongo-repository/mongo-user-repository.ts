import { IUser } from "@/application/infra/interfaces/user-interface";
import { InternalServerError, NotFoundError } from "@/application/errors";
import { TResult } from "@/application/helpers";
import { logger } from "@/application/lib";

import { CreateUser, IUserRepository } from "../user-repository";
import { UserModel } from "../../mongo/models/user-model";

const model = new UserModel().getModel();

export class MongoUserRepository implements IUserRepository {
  async createOne({
    name,
    email,
    balance,
  }: CreateUser): Promise<TResult<IUser>> {
    try {
      const result = await model.create({
        name,
        email,
        balance,
      });

      return {
        success: true,
        result,
      };
    } catch (error) {
      logger.error(error);
      throw new InternalServerError(
        "Oops, something went wrong on create user on database",
      );
    }
  }
  async findById(id: string): Promise<TResult<IUser | null>> {
    try {
      const result = await model.findById(id);

      return {
        result,
        success: true,
      };
    } catch (error) {
      logger.error(error);
      throw new InternalServerError(
        "Oops, something went wrong on find user on database",
      );
    }
  }

  async findByEmail(
    email: string,
    excludeOwnerUserId?: string,
  ): Promise<TResult<IUser | null>> {
    try {
      let query: Record<string, any> = { email };

      if (excludeOwnerUserId) {
        query["_id"] = { $ne: excludeOwnerUserId };
      }

      const result = await model.findOne(query);

      return {
        result,
        success: true,
      };
    } catch (error) {
      throw new InternalServerError(
        "Oops, something went wrong on find user by email on database",
      );
    }
  }

  async updateOne(
    id: string,
    data: { name: string; email: string },
  ): Promise<TResult<IUser>> {
    try {
      const result = await model.findByIdAndUpdate(id, data);

      if (!result) {
        throw new NotFoundError("User not found");
      }

      return {
        success: true,
        result,
      };
    } catch (error) {
      logger.error(error);
      throw new InternalServerError(
        "Oops, something went wrong on update user on database",
      );
    }
  }

  async updateBalance(id: string, balance: number): Promise<void> {
    try {
      await model.findByIdAndUpdate(id, { balance });
    } catch (error) {
      logger.error(error);
      throw new InternalServerError(
        "Oops, something went wrong on update user balance on database",
      );
    }
  }
}
