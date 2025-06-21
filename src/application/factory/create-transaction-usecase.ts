import { CreateTransactionDTO } from "../dtos";
import { IdempotencyError, TooManyRequestError } from "../errors";
import { ICacheService, ITransactionRepository } from "../infra";

const MAX_TRANSACTIONS_USER_REQUESTS_PER_MINUTE = 5;

export class CreateTransactionUsecase {
  constructor(
    private readonly repository: ITransactionRepository,
    private readonly cacheService: ICacheService,
  ) {}

  async execute(data: CreateTransactionDTO) {
    const requests = await this.cacheService.getRateLimit(data.payer_id);

    if (requests > MAX_TRANSACTIONS_USER_REQUESTS_PER_MINUTE) {
      throw new TooManyRequestError(
        "Too many requests, please try again later",
      );
    }

    const isDuplicatedOperation = await this.cacheService.getHashData(data);

    if (isDuplicatedOperation) {
      throw new IdempotencyError("Transaction already processed");
    }

    const response = await this.repository.createOne(data);

    if (response.success) {
      await Promise.all([
        this.cacheService.setRateLimit(data.payer_id),
        this.cacheService.setHashData(data),
      ]);
    }

    return response;
  }
}
