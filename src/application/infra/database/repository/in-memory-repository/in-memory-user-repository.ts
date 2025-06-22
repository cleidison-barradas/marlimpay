import { randomUUID } from "node:crypto";
import { IUser } from "@/application/infra/interfaces/user-interface";
import { BadRequestError } from "@/application/errors";
import { TResult } from "@/application/helpers";

import { CreateUser, IUserRepository, UpdateUser } from "../user-repository";

export class InMemoryUserRepository implements IUserRepository {
  private users: IUser[] = [];

  async createOne(data: CreateUser): Promise<TResult<IUser>> {
    try {
      return new Promise((resolve) => {
        this.users.push({
          _id: randomUUID(),
          ...data,
        } as any);

        const result = this.users.find(
          (user) => user.email === data.email,
        ) as IUser;

        resolve({
          result,
          success: true,
        });
      });
    } catch (error) {
      throw new BadRequestError(
        "Oops, something went wrong on create user on database",
      );
    }
  }
  async findById(id: string): Promise<TResult<IUser | null>> {
    try {
      return new Promise((resolve, reject) => {
        const result = this.users.find(
          (_user) => String(_user._id) === id,
        ) as IUser;

        resolve({
          success: true,
          result,
        });
      });
    } catch (error) {
      throw new BadRequestError(
        "Oops, something went wrong on find user on database",
      );
    }
  }
  async findByEmail(email: string): Promise<TResult<IUser | null>> {
    try {
      return new Promise((resolve, reject) => {
        const result = this.users.find((user) => user.email === email) as IUser;

        resolve({
          success: true,
          result,
        });
      });
    } catch (error) {
      throw new BadRequestError(
        "Oops, something went wrong on find user by email on database",
      );
    }
  }
  async updateOne(id: string, data: UpdateUser): Promise<TResult<IUser>> {
    try {
      return new Promise((resolve, reject) => {
        const index = this.users.findIndex(
          (user) => (user._id as string) === id,
        );

        this.users[index] = {
          ...this.users[index],
          ...data,
        } as IUser;

        resolve({
          success: true,
          result: this.users[index],
        });
      });
    } catch (error) {
      throw new BadRequestError(
        "Oops, something went wrong on update user on database",
      );
    }
  }

  async updateBalance(id: string, balance: number): Promise<void> {
    try {
      return new Promise(() => {
        const index = this.users.findIndex(
          (user) => (user._id as string) === id,
        );

        this.users[index] = {
          ...this.users[index],
          balance,
        } as IUser;
      });
    } catch (error) {
      throw new BadRequestError(
        "Oops, something went wrong on update user balance on database",
      );
    }
  }
}
