import { faker } from "@faker-js/faker";
import { InMemoryUserRepository } from "../infra";
import { UpdateUserUseCase } from "./update-user-usecase";

describe("UpdateUseCase Test", () => {
  let usecase: UpdateUserUseCase;
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
    usecase = new UpdateUserUseCase(repository);
  });

  it("Should be able to update a user", async () => {
    const randomUser = createRandomUser();
    await repository.createOne(randomUser);

    const data = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    };

    const result = await usecase.execute(randomUser._id, data);

    const user = result.success ? result.result : null;

    expect(user).not.toBeNull;
    expect(user).toHaveProperty("_id", randomUser._id);
    expect(user).toHaveProperty("name", data.name);
    expect(user).toHaveProperty("email", data.email);
  });

  it("Should not be able to update a user with not existing id", async () => {
    expect(
      usecase.execute(faker.database.mongodbObjectId(), {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      }),
    ).rejects.toThrow("User not found");
  });

  it("Should not be able to update a user with same email", async () => {
    const response = await repository.createOne(createRandomUser());

    const email = "faker.another@email.com";

    await repository.createOne({
      name: faker.person.fullName(),
      email,
      balance: 5000,
    });

    expect(
      usecase.execute(response.success ? (response.result._id as string) : "", {
        email,
        name: faker.person.fullName(),
      }),
    ).rejects.toThrow("User email already in use");
  });
});
