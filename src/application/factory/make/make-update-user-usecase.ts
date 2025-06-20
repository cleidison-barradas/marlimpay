import { MongoUserRepository } from "@/application/infra";
import { UpdateUserUseCase } from "../update-user-usecase";

export function makeUpdateUserUseCase() {
  const repository = new MongoUserRepository();

  return new UpdateUserUseCase(repository);
}
