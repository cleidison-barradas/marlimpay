import { MongoUserRepository } from "@/application/infra";
import { CreateUserUsecase } from "../create-user-usecase";

export function makeCreateUserUseCase() {
  const repository = new MongoUserRepository();

  return new CreateUserUsecase(repository);
}
