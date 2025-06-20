import { IUser } from "@/application/infra/interfaces/user-interface";
import { BadRequestError, NotFoundError } from "@/application/errors";
import { TResult } from "@/application/helpers";

import { UserModel } from "../../mongo/models/user-model";
import { IUserRepository } from "../user-repository";
import { logger } from "@/application/lib";

const model = new UserModel().getModel();

export class MongoUserRepository implements IUserRepository {
  async createOne(data: {
    name: string;
    email: string;
    balance: number;
  }): Promise<TResult<IUser>> {
    try {
      const result = await model.create(data);

      return {
        success: true,
        result,
      };
    } catch (error) {
      logger.error(error);
      throw new BadRequestError(
        "Oops, something went wrong on create user on database",
      );
    }
  }
  async findById(id: string): Promise<TResult<IUser | null>> {
    try {
      const result = await model.findById(id);

      if (!result) {
        return {
          success: true,
          result: null,
        };
      }

      return {
        result,
        success: true,
      };
    } catch (error) {
      logger.error(error);
      throw new BadRequestError(
        "Oops, something went wrong on find user on database",
      );
    }
  }
  async updateOne(
    id: string,
    data: { name: string; email: string },
  ): Promise<TResult<IUser>> {
    try {
      let result = await model.findById(id);

      if (!result) {
        throw new NotFoundError("User not found");
      }

      await result.updateOne(data);

      result = await model.findById(id);

      if (!result) {
        throw new NotFoundError("User not found");
      }

      return {
        result,
        success: true,
      };
    } catch (error) {
      logger.error(error);
      throw new BadRequestError(
        "Oops, something went wrong on update user on database",
      );
    }
  }
}
