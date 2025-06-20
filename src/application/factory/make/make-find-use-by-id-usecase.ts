import { MongoUserRepository } from "@/application/infra";
import { FindUserByIdUseCase } from "../find-user-by-id-usecase";

export function makeFindUserByIdUseCase() {
  const repository = new MongoUserRepository();

  return new FindUserByIdUseCase(repository);
}
