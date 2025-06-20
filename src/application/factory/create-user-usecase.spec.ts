import { faker } from "@faker-js/faker";

import { CreateUserUsecase } from "./create-user-usecase";
import { InMemoryUserRepository } from "../infra";

describe("CreateUseCase Test", () => {
  let usecase: CreateUserUsecase;
  let repository: InMemoryUserRepository;

  function createRandomUser() {
    return {
      _id: faker.database.mongodbObjectId(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      balance: 5000,
    };
  }

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    usecase = new CreateUserUsecase(repository);
  });

  it("Should be able to create a user", async () => {
    const user = createRandomUser();
    const result = await usecase.execute(user);

    const data = result.success ? result.result : null;

    expect(data).toBeNull;
    expect(data).toHaveProperty("_id");
    expect(data).toHaveProperty("name", user.name);
    expect(data).toHaveProperty("email", user.email);
    expect(data).toHaveProperty("balance", user.balance);
  });

  it("Should not be able to create a user with same email", async () => {
    const user = createRandomUser();
    await repository.createOne(user);

    expect(usecase.execute(user)).rejects.toThrow("User email already in use");
  });
});
