import { faker } from "@faker-js/faker";
import { InMemoryTransactionRepository } from "../infra";
import { FindTransactionByIdUseCase } from "./find-transaction-by-id-usecase";

describe("FindTransactionByIdUseCase Test", () => {
  let usecase: FindTransactionByIdUseCase;
  let repository: InMemoryTransactionRepository;

  function createRandomTransaction() {
    return {
      _id: faker.database.mongodbObjectId(),
      amount: 100,
      type: "sent",
      status: "pending",
      receiver_id: faker.database.mongodbObjectId(),
      payer_id: faker.database.mongodbObjectId(),
    };
  }

  beforeEach(async () => {
    repository = new InMemoryTransactionRepository();
    usecase = new FindTransactionByIdUseCase(repository);
  });

  it("Should be able to find a transaction by id", async () => {
    const randomTransaction = createRandomTransaction();

    await repository.createOne(randomTransaction);

    const result = await usecase.execute(randomTransaction._id);

    const transactionCreated = result.success ? result.result : null;

    expect(transactionCreated).not.toBeNull;
    expect(transactionCreated).toHaveProperty("_id");
    expect(transactionCreated).toHaveProperty(
      "amount",
      randomTransaction.amount,
    );
    expect(transactionCreated).toHaveProperty(
      "receiver_id",
      randomTransaction.receiver_id,
    );
    expect(transactionCreated).toHaveProperty(
      "payer_id",
      randomTransaction.payer_id,
    );
  });

  it("Should be able to not find a transaction by id", async () => {
    expect(usecase.execute(faker.database.mongodbObjectId())).rejects.toThrow(
      "Transaction not found",
    );
  });
});
