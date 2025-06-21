import { faker } from "@faker-js/faker";
import { InMemoryTransactionRepository } from "../infra";
import { ListTransactionsByIdUserIdUseCase } from "./list-transactions-by-user-id-usecase";

describe("ListTransactionsByUserIdUseCase Test", () => {
  let usecase: ListTransactionsByIdUserIdUseCase;
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

  beforeEach(() => {
    repository = new InMemoryTransactionRepository();
    usecase = new ListTransactionsByIdUserIdUseCase(repository);
  });

  it("Should be able to list transactions by user id", async () => {
    const randomTransaction = createRandomTransaction();
    await repository.createOne(randomTransaction);

    const result = await usecase.execute(randomTransaction.payer_id);

    const transactionCreated = result.success ? result.result : [];

    expect(transactionCreated).not.toBeNull;
    expect(transactionCreated).toHaveLength(1);
  });
});
