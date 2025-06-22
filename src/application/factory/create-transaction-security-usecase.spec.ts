import { faker } from "@faker-js/faker";
import { InMemoryTransactionSecurityRepository } from "../infra";
import { CreateTransactionSecurityUseCase } from "./create-transaction-security-usecase";

describe("CreateTransactionSecurityUsecase Test", () => {
  let usecase: CreateTransactionSecurityUseCase;
  let transactionSecurityRepository: InMemoryTransactionSecurityRepository;

  function createRandomTransactionPayload() {
    return {
      amount: Number(faker.finance.amount({ min: 1, max: 99 })),
      payer_id: faker.string.uuid(),
      receiver_id: faker.string.uuid(),
    };
  }

  beforeEach(() => {
    transactionSecurityRepository = new InMemoryTransactionSecurityRepository();
    usecase = new CreateTransactionSecurityUseCase(
      transactionSecurityRepository,
    );
  });

  it("Should be able to create a transaction security", async () => {
    const payload = createRandomTransactionPayload();

    const response = await usecase.execute(payload);

    const transactionSecurity = response.success ? response.result : null;

    expect(transactionSecurity).not.toBeNull;
    expect(transactionSecurity).toHaveProperty("security_hash");
  });

  it("Should not be able to create a transaction security with same payload", async () => {
    const payload = createRandomTransactionPayload();
    await usecase.execute(payload);

    expect(usecase.execute(payload)).rejects.toThrow(
      "Transaction cannot be created with the same identifier",
    );
  });
});
