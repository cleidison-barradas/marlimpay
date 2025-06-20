import { faker } from "@faker-js/faker";
import { InMemoryUserRepository } from "../infra";
import { FindUserByIdUseCase } from "./find-user-by-id-usecase";

describe("FindUserByIdUseCase Test", () => {
  let usecase: FindUserByIdUseCase;
  let repository: InMemoryUserRepository;

  function createRandomUser() {
    return {
      _id: faker.database.mongodbObjectId(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      balance: 5000,
    };
  }

  beforeEach(async () => {
    repository = new InMemoryUserRepository();
    usecase = new FindUserByIdUseCase(repository);
  });

  it("Should be able to find a user by id", async () => {
    const randomUser = createRandomUser();

    await repository.createOne(randomUser);

    const result = await usecase.execute(randomUser._id);

    const userCreated = result.success ? result.result : null;

    expect(userCreated).not.toBeNull;
    expect(userCreated).toHaveProperty("_id");
    expect(userCreated).toHaveProperty("name", randomUser.name);
    expect(userCreated).toHaveProperty("email", randomUser.email);
    expect(userCreated).toHaveProperty("balance", randomUser.balance);
  });

  it("Shold not be able to find a user by id", async () => {
    expect(usecase.execute(faker.database.mongodbObjectId())).rejects.toThrow(
      "User not found",
    );
  });
});
