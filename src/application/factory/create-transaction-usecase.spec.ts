import { faker } from "@faker-js/faker";
import { CreateTransactionUsecase } from "./create-transaction-usecase";
import { InMemoryTransactionRepository } from "../infra";
import { InMemoryCacheService } from "../services";

describe("CreateTransactionUsecase Test", () => {
  let usecase: CreateTransactionUsecase;
  let inMemoryCacheService: InMemoryCacheService;
  let repository: InMemoryTransactionRepository;

  function createRandomTransaction() {
    return {
      _id: faker.database.mongodbObjectId(),
      amount: faker.number.int({ min: 100, max: 999 }),
      type: "sent",
      status: "pending",
      receiver_id: faker.database.mongodbObjectId(),
      payer_id: faker.database.mongodbObjectId(),
    };
  }

  beforeEach(() => {
    inMemoryCacheService = new InMemoryCacheService();
    repository = new InMemoryTransactionRepository();
    usecase = new CreateTransactionUsecase(repository, inMemoryCacheService);
  });

  it("Should be able to create a transaction", async () => {
    const randomTransaction = createRandomTransaction();

    const result = await usecase.execute(randomTransaction);

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

  it("Should be not to be able to create a transaction operation duplicated", async () => {
    const randomTransaction = createRandomTransaction();

    await usecase.execute(randomTransaction);

    expect(usecase.execute(randomTransaction)).rejects.toThrow(
      "Transaction already processed",
    );
  });

  it("Should be not to be able to the same user to create more than 5 transactions per minute", async () => {
    const payer_id = faker.database.mongodbObjectId();

    let transactions = faker.helpers.multiple(createRandomTransaction, {
      count: 6,
    });

    transactions = transactions.map((transaction) => {
      transaction.payer_id = payer_id;
      return transaction;
    });

    try {
      for (const transaction of transactions) {
        await usecase.execute(transaction);
      }
    } catch (error) {
      expect(error).toThrow("Transaction limit exceeded");
    }
  });
});
